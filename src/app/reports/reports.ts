import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  Navbar
} from '../navbar/navbar';

import {
  ExpenseService
} from '../services/expense';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatCardModule
} from '@angular/material/card';


@Component({
  selector: 'app-reports',

  imports: [
    Navbar,
    MatIconModule,
    MatCardModule,
    DecimalPipe
  ],

  templateUrl: './reports.html',

  styleUrl: './reports.css'
})
export class Reports {

  expenseService =
    inject(ExpenseService);


  averageExpense = computed(() => {

    const expenses =
      this.expenseService.expenses();

    if (expenses.length === 0) {
      return 0;
    }

    return (
      this.expenseService.totalExpenses()
      /
      expenses.length
    );

  });


  categoryPercentages = computed(() => {

    const total =
      this.expenseService.totalExpenses();

    const categories =
      this.expenseService.categoryTotals();


    if (total === 0) {

      return categories.map(
        category => ({
          ...category,
          percentage: 0
        })
      );

    }


    return categories.map(
      category => ({

        ...category,

        percentage:
          (category.amount / total) * 100

      })
    );

  });




  getCategoryColor(index: number) {

    return this.expenseService
      .getCategoryColor(index);

  }

}