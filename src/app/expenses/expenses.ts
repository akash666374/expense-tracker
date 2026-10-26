
import {
  Component,
  OnInit,
  ViewChild,
  inject,
  signal
} from '@angular/core';

import { Navbar } from '../navbar/navbar';

import {
  AddExpense,
  ExpenseFormData
} from '../add-expense/add-expense';

import { ExpenseList } from '../expense-list/expense-list';

import {
  ExpenseService,
  Expense
} from '../services/expense';

import { AuthService } from '../services/auth';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  catchError,
  finalize,
  take
} from 'rxjs/operators';

import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    Navbar,
    AddExpense,
    ExpenseList,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class Expenses implements OnInit {
  readonly expenseService = inject(ExpenseService);
  readonly authService = inject(AuthService);

  @ViewChild(AddExpense)
  addExpenseComponent!: AddExpense;

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly showUpdateConfirmation = signal(false);
  readonly pendingUpdate = signal<ExpenseFormData | null>(null);

  ngOnInit(): void {
    this.getExpenses();
  }

  getExpenses(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    let userId: string | undefined;

    if (this.authService.isAdmin()) {
      userId = undefined;
    } else {
      userId = this.authService.currentUser().id;
    }

    this.expenseService.getExpenses(userId)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error loading expenses:', error);
          this.errorMessage.set('Failed to load expenses.');
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe();
  }

  switchUser(userId: string): void {
    this.authService.switchUser(userId);
    this.expenseService.clearFilters();
    this.getExpenses();
  }

  saveExpense(data: ExpenseFormData): void {
    if (data.id === null) {
      this.addExpense(data);
    } else {
      this.updateExpense(data.id, data);
    }
  }

  requestUpdateConfirmation(data: ExpenseFormData): void {
    this.pendingUpdate.set(data);
    this.showUpdateConfirmation.set(true);
  }

  cancelUpdate(): void {
    this.showUpdateConfirmation.set(false);
    this.pendingUpdate.set(null);
  }

  confirmUpdate(): void {
    const data = this.pendingUpdate();

    if (data === null || data.id === null) {
      return;
    }

    this.showUpdateConfirmation.set(false);
    this.pendingUpdate.set(null);

    this.updateExpense(data.id, data);
  }

  addExpense(data: ExpenseFormData): void {
    const currentUserId = this.authService.currentUser().id;

    const newExpense = {
      userId: currentUserId,
      name: data.name,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      time: data.time,
      createdBy: currentUserId,
      modifiedBy: currentUserId
    };

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.expenseService.addExpense(newExpense)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error adding expense:', error);
          this.errorMessage.set('Failed to add expense.');
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(createdExpense => {
        let shouldDisplay = false;

        if (this.authService.isAdmin()) {
          shouldDisplay = true;
        } else if (
          createdExpense.userId === this.authService.currentUser().id
        ) {
          shouldDisplay = true;
        }

        if (shouldDisplay) {
          this.expenseService.expenses.update(expenses => [
            ...expenses,
            createdExpense
          ]);
        }

        this.successMessage.set('Expense added successfully.');
        this.addExpenseComponent.clearForm();
      });
  }

  updateExpense(id: number, data: ExpenseFormData): void {
    const existingExpense = this.expenseService
      .expenses()
      .find(expense => expense.id === id);

    if (!existingExpense) {
      this.errorMessage.set('Expense not found.');
      return;
    }

    if (
      !this.authService.isAdmin() &&
      existingExpense.userId !== this.authService.currentUser().id
    ) {
      this.errorMessage.set('You cannot edit another user’s expense.');
      return;
    }

    const currentUserId = this.authService.currentUser().id;

    const updatedData = {
      name: data.name,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      time: data.time,
      createdBy: existingExpense.createdBy ?? existingExpense.userId,
      modifiedBy: currentUserId
    };

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.expenseService.updateExpense(id, updatedData)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error updating expense:', error);
          this.errorMessage.set('Failed to update expense.');
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(updatedExpense => {
        this.expenseService.expenses.update(expenses =>
          expenses.map(expense => {
            if (expense.id === id) {
              return {
                ...updatedExpense,
                userId: existingExpense.userId,
                createdBy: existingExpense.createdBy ?? existingExpense.userId,
                modifiedBy: currentUserId
              };
            }

            return expense;
          })
        );

        this.successMessage.set('Expense updated successfully.');
        this.addExpenseComponent.clearForm();
      });
  }

  editExpense(id: number): void {
    const expense = this.expenseService
      .expenses()
      .find(item => item.id === id);

    if (!expense) {
      this.errorMessage.set('Expense not found.');
      return;
    }

    if (
      !this.authService.isAdmin() &&
      expense.userId !== this.authService.currentUser().id
    ) {
      this.errorMessage.set('You cannot edit another user’s expense.');
      return;
    }

    this.addExpenseComponent.editExpense(expense);
  }

  deleteExpense(id: number): void {
    const expense = this.expenseService
      .expenses()
      .find(item => item.id === id);

    if (!expense) {
      this.errorMessage.set('Expense not found.');
      return;
    }

    if (
      !this.authService.isAdmin() &&
      expense.userId !== this.authService.currentUser().id
    ) {
      this.errorMessage.set('You cannot delete another user’s expense.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.expenseService.deleteExpense(id)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error deleting expense:', error);
          this.errorMessage.set('Failed to delete expense.');
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(() => {
        this.expenseService.expenses.update(expenses =>
          expenses.filter(item => item.id !== id)
        );

        this.successMessage.set('Expense deleted successfully.');
      });
  }
}
