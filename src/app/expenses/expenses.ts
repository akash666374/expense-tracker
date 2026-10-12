
import {
  Component,
  inject,
  ViewChild,
  signal,
  OnInit
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

import { MatCardModule } from '@angular/material/card';

import {
  tap,
  take,
  catchError,
  finalize
} from 'rxjs/operators';

import { throwError } from 'rxjs';

@Component({
  selector: 'app-expenses',

  imports: [
    Navbar,
    AddExpense,
    ExpenseList,
    MatCardModule
  ],

  templateUrl: './expenses.html',

  styleUrl: './expenses.css'
})
export class Expenses implements OnInit {

  expenseService = inject(ExpenseService);

  @ViewChild(AddExpense)
  addExpenseComponent!: AddExpense;

  loading = signal(false);

  errorMessage = signal('');

  successMessage = signal('');

  ngOnInit() {
    this.getExpenses();
  }

  getExpenses() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.expenseService
      .getExpenses()
      .pipe(
        tap(() => {
          console.log('Expenses received from server');
        }),

        take(1),

        catchError(error => {
          console.log(
            'Error while loading expenses:',
            error
          );

          this.errorMessage.set(
            'Failed to load expenses'
          );

          return throwError(() => error);
        }),

        finalize(() => {
          this.loading.set(false);
          console.log('Loading finished');
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Expenses:', data);

          this.expenseService
            .expenses
            .set(data);
        },

        error: (error) => {
          console.log('GET request failed:', error);
        }
      });
  }

  saveExpense(data: ExpenseFormData) {
    if (data.id === null) {
      this.addExpense(data);
    } else {
      this.updateExpense(data.id, data);
    }
  }

  addExpense(data: ExpenseFormData) {
    this.expenseService
      .addExpense({
        name: data.name,
        amount: data.amount,
        category: data.category,
        date: data.date
      })
      .subscribe({
        next: (newExpense) => {
          console.log('Expense added:', newExpense);

          this.expenseService
            .expenses
            .update(expenses => [
              ...expenses,
              newExpense
            ]);

          this.successMessage.set(
            'Expense added successfully'
          );

          this.addExpenseComponent.clearForm();
        },

        error: (error) => {
          console.log('POST request failed:', error);

          this.errorMessage.set(
            'Failed to add expense'
          );
        },

        complete: () => {
          console.log('POST request completed');
        }
      });
  }

  updateExpense(
    id: string,
    data: ExpenseFormData
  ) {
    this.expenseService
      .updateExpense(
        id,
        {
          name: data.name,
          amount: data.amount,
          category: data.category,
          date: data.date
        }
      )
      .subscribe({
        next: (updatedExpense) => {
          console.log(
            'Expense updated:',
            updatedExpense
          );

          this.expenseService
            .expenses
            .update(expenses =>
              expenses.map(expense =>
                expense.id === updatedExpense.id
                  ? updatedExpense
                  : expense
              )
            );

          this.successMessage.set(
            'Expense updated successfully'
          );

          this.addExpenseComponent.clearForm();
        },

        error: (error) => {
          console.log('PATCH request failed:', error);

          this.errorMessage.set(
            'Failed to update expense'
          );
        },

        complete: () => {
          console.log('PATCH request completed');
        }
      });
  }

  editExpense(id: string) {
    const expense = this.expenseService
      .expenses()
      .find(expense => expense.id === id);

    if (expense) {
      this.addExpenseComponent.editExpense(expense);
    }
  }

  deleteExpense(id: string) {
    this.expenseService
      .deleteExpense(id)
      .subscribe({
        next: () => {
          console.log('Expense deleted:', id);

          this.expenseService
            .expenses
            .update(expenses =>
              expenses.filter(
                expense => expense.id !== id
              )
            );

          this.successMessage.set(
            'Expense deleted successfully'
          );
        },

        error: (error) => {
          console.log('DELETE request failed:', error);

          this.errorMessage.set(
            'Failed to delete expense'
          );
        },

        complete: () => {
          console.log('DELETE request completed');
        }
      });
  }

  String(value: string | number): string {
    return value.toString();
  }

}
