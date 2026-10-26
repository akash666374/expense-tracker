
import {
  Component,
  input,
  output,
  inject
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { Expense } from '../services/expense';
import { AuthService } from '../services/auth';

export interface ExpenseFormData {
  id: number | null;
  name: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  createdBy: string;
  modifiedBy: string;
}

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})
export class AddExpense {
  private authService = inject(AuthService);

  title = input('Add Expense');

  expenseAdded = output<ExpenseFormData>();
  updateConfirmationRequested = output<ExpenseFormData>();

  expenseForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    amount: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),

    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    time: new FormControl('', {
      nonNullable: true
    })
  });

  editingId: number | null = null;

  private originalCreatedBy: string | null = null;

  addExpense(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const data = this.getExpenseFormData();

    if (this.editingId !== null) {
      this.updateConfirmationRequested.emit(data);
      return;
    }

    this.expenseAdded.emit(data);
  }

  private getExpenseFormData(): ExpenseFormData {
    const formData = this.expenseForm.getRawValue();
    const currentUserId = this.authService.currentUser().id;

    return {
      id: this.editingId,
      name: formData.name,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      time: new Date().toLocaleTimeString(),
      createdBy: this.originalCreatedBy ?? currentUserId,
      modifiedBy: currentUserId
    };
  }

  editExpense(expense: Expense): void {
    this.editingId = expense.id;

    this.originalCreatedBy =
      expense.createdBy ?? expense.userId;

    this.expenseForm.patchValue({
      name: expense.name,
      amount: Number(expense.amount),
      category: expense.category,
      date: expense.date,
      time: expense.time
    });
  }

  clearForm(): void {
    this.expenseForm.reset({
      name: '',
      amount: 0,
      category: '',
      date: '',
      time: ''
    });

    this.editingId = null;
    this.originalCreatedBy = null;
  }
}
