
import {
  Component,
  inject,
  output,
  ViewChild,
  effect
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  MatSnackBarModule,
  MatSnackBar
} from '@angular/material/snack-bar';

import { ExpenseService, Expense } from '../services/expense';

import { DatePipe } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatCheckboxModule,
    MatMenuModule

  ],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css'
})
export class ExpenseList {

  readonly expenseService = inject(ExpenseService);
  readonly snackBar = inject(MatSnackBar);

  readonly expenses = this.expenseService.expenses;

  searchText = '';
  selectedCategory = '';

  editExpense = output<number>();
  deleteExpenseEvent = output<number>();

  showCreatedBy = false;
  showModifiedBy = false;

  displayedColumns: string[] = [
    'name',
    'amount',
    'category',
    'CREATED-ON',
    'modifiedOn',
    'actions'
  ];

  updateDisplayedColumns(): void {
    this.displayedColumns = [
      'name',
      'amount',
      'category',
      'CREATED-ON',
      'modifiedOn'
    ];

    if (this.showCreatedBy) {
      this.displayedColumns.push('createdBy');
    }

    if (this.showModifiedBy) {
      this.displayedColumns.push('modifiedBy');
    }

    this.displayedColumns.push('actions');
  }
  dataSource = new MatTableDataSource<Expense>([]);

  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor() {
    effect(() => {
      const expenseRecords = this.expenses();

      this.dataSource.data =
        this.filterExpenses(expenseRecords);

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  private filterExpenses(expenseRecords: Expense[]): Expense[] {
    const search = this.searchText.toLowerCase().trim();

    return expenseRecords.filter(expense => {

      let matchesName = false;

      if (expense.name) {
        matchesName =
          expense.name.toLowerCase().includes(search);
      }

      let matchesCategory = false;

      if (this.selectedCategory === '') {
        matchesCategory = true;
      } else if (expense.category === this.selectedCategory) {
        matchesCategory = true;
      }

      return matchesName && matchesCategory;
    });
  }

  searchExpenses(): Expense[] {
    return this.filterExpenses(this.expenses());
  }

  resetPagination(): void {
    this.dataSource.data = this.searchExpenses();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id: number): void {
    this.editExpense.emit(id);
  }

  delete(id: number): void {
    const snackBarRef = this.snackBar.open(
      'Are you sure you want to delete this expense?',
      'Delete',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.deleteExpenseEvent.emit(id);
    });
  }
}
