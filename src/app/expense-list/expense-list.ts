
import {
  Component,
  inject,
  output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatSnackBarModule,
  MatSnackBar
} from '@angular/material/snack-bar';

import {
  ExpenseService
} from '../services/expense';

@Component({
  selector: 'app-expense-list',

  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],

  templateUrl: './expense-list.html',

  styleUrl: './expense-list.css'
})
export class ExpenseList {

  expenseService =
    inject(ExpenseService);

  expenses =
    this.expenseService.expenses;

  searchText = '';

  selectedCategory = '';

  editExpense =
    output<string>();

  deleteExpenseEvent =
    output<string>();

  snackBar =
    inject(MatSnackBar);

  currentPage = 1;

  itemsPerPage = 5;


  searchExpenses() {

    return this.expenses()
      .filter(expense => {

        const matchesName =
          expense.name
            .toLowerCase()
            .includes(
              this.searchText.toLowerCase()
            );

        const matchesCategory =
          this.selectedCategory === '' ||
          expense.category ===
          this.selectedCategory;

        return (
          matchesName &&
          matchesCategory
        );

      });

  }


  getPaginatedExpenses() {

    const filteredExpenses =
      this.searchExpenses();

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const endIndex =
      startIndex +
      this.itemsPerPage;

    return filteredExpenses.slice(
      startIndex,
      endIndex
    );

  }


  getTotalPages() {

    const totalExpenses =
      this.searchExpenses().length;

    return Math.ceil(
      totalExpenses /
      this.itemsPerPage
    );

  }


  getPageNumbers() {

    const pages = [];

    for (
      let i = 1; i <= this.getTotalPages(); i++
    ) {

      pages.push(i);

    }

    return pages;

  }


  nextPage() {

    if (
      this.currentPage <
      this.getTotalPages()
    ) {

      this.currentPage++;

    }

  }


  previousPage() {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

    }

  }


  goToPage(
    page: number
  ) {

    this.currentPage = page;

  }


  resetPagination() {

    this.currentPage = 1;

  }


  edit(
    id: string
  ) {

    this.editExpense.emit(id);

  }


  delete(
    id: string
  ) {

    const snackBarRef =
      this.snackBar.open(
        'Are you sure you want to delete this expense?',
        'Delete',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
      );

    snackBarRef
      .onAction()
      .subscribe(() => {

        this.deleteExpenseEvent.emit(id);

      });

  }

}
