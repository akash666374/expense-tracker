
import {
  Component,
  input,
  output
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatIconModule }
  from '@angular/material/icon';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatInputModule }
  from '@angular/material/input';

import { MatSelectModule }
  from '@angular/material/select';

import { MatButtonModule }
  from '@angular/material/button';

import { Expense }
  from '../services/expense';

export interface ExpenseFormData {
  id: string | null;
  name: string;
  amount: number;
  category: string;
  date: string;
}

@Component({
  selector: 'app-add-expense',

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

  title =
    input('Add Expense');

  expenseAdded =
    output<ExpenseFormData>();

  expenseForm =
    new FormGroup({

      name: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [Validators.required]
        }
      ),

      amount: new FormControl(
        0,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.min(1)
          ]
        }
      ),

      category: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [Validators.required]
        }
      ),

      date: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [Validators.required]
        }
      )

    });

  editingId: string | null = null;

  showUpdateConfirmation = false;

  addExpense() {

    if (this.expenseForm.invalid) {

      this.expenseForm.markAllAsTouched();

      return;
    }

    if (this.editingId !== null) {

      this.showUpdateConfirmation = true;

      return;
    }

    this.emitExpense();

  }

  confirmUpdate() {

    this.showUpdateConfirmation = false;

    this.emitExpense();

  }

  cancelUpdate() {

    this.showUpdateConfirmation = false;

  }

  emitExpense() {

    this.expenseAdded.emit({

      id: this.editingId,

      ...this.expenseForm.getRawValue()

    });

  }

  editExpense(
    expense: Expense
  ) {

    this.editingId =
      expense.id;

    this.expenseForm.patchValue({

      name:
        expense.name,

      amount:
        expense.amount,

      category:
        expense.category,

      date:
        expense.date

    });

    this.showUpdateConfirmation = false;

  }

  clearForm() {

    this.expenseForm.reset({

      name: '',

      amount: 0,

      category: '',

      date: ''

    });

    this.editingId = null;

    this.showUpdateConfirmation = false;

  }

}
