
import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  ExpenseService,
  Expense
} from '../services/expense';

@Component({
  selector: 'app-expense-details',

  imports: [],

  templateUrl: './expense-details.html',

  styleUrl: './expense-details.css'
})
export class ExpenseDetails {

  route =
    inject(ActivatedRoute);

  expenseService =
    inject(ExpenseService);

  expense: Expense | null = null;

  constructor() {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id !== null) {

      const expenseId =
        id;

      const expense =
        this.expenseService
          .expenses()
          .find(
            expense =>
              expense.id === expenseId
          );

      if (expense) {

        this.expense =
          expense;

      }

    }

  }

}
