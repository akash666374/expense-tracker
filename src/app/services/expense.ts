import {
  Injectable,
  signal,
  computed,
  inject
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export interface ExpenseData {
  name: string;
  amount: number;
  category: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  expenses = signal<Expense[]>([]);

  totalExpenses = computed(() =>
    this.expenses().reduce(
      (total, expense) => total + expense.amount,
      0
    )
  );

  highestExpense = computed(() =>
    this.expenses().reduce(
      (highest, expense) =>
        Math.max(highest, expense.amount),
      0
    )
  );

  categoryTotals = computed(() => {
    const totals: {
      category: string;
      amount: number;
    }[] = [];

    this.expenses().forEach(expense => {
      const existing = totals.find(
        item => item.category === expense.category
      );

      if (existing) {
        existing.amount += expense.amount;
      } else {
        totals.push({
          category: expense.category,
          amount: expense.amount
        });
      }
    });

    return totals;
  });

  categoryChart = computed(() => {
    const categories = this.categoryTotals();
    const total = this.totalExpenses();

    if (total === 0) {
      return '';
    }

    const colors = [
      '#4f46e5',
      '#06b6d4',
      '#f59e0b',
      '#10b981',
      '#ec4899',
      '#8b5cf6'
    ];

    let start = 0;
    const parts: string[] = [];

    categories.forEach((item, index) => {
      const percentage = (item.amount / total) * 100;
      const end = start + percentage;
      const color = colors[index % colors.length];

      parts.push(`${color} ${start}% ${end}%`);
      start = end;
    });

    return `conic-gradient(${parts.join(', ')})`;
  });

  http = inject(HttpClient);

  getCategoryColor(index: number): string {
    const colors = [
      '#4f46e5',
      '#06b6d4',
      '#f59e0b',
      '#10b981',
      '#ec4899',
      '#8b5cf6'
    ];

    return colors[index % colors.length];
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(
      'http://localhost:3000/expenses'
    ).pipe(
      tap(expenses => this.expenses.set(expenses))
    );
  }

  searchExpenses(
    searchText: string
  ): Observable<Expense[]> {
    if (searchText === '') {
      return this.getExpenses();
    }

    return this.http.get<Expense[]>(
      `http://localhost:3000/expenses?name:contains=${searchText}`
    );
  }

  getExpenseById(
    id: string
  ): Observable<Expense> {
    return this.http.get<Expense>(
      `http://localhost:3000/expenses/${id}`
    );
  }

  addExpense(
    expense: ExpenseData
  ): Observable<Expense> {
    return this.http.post<Expense>(
      'http://localhost:3000/expenses',
      expense
    );
  }

  updateExpense(
    id: string,
    expense: ExpenseData
  ): Observable<Expense> {
    return this.http.patch<Expense>(
      `http://localhost:3000/expenses/${id}`,
      expense
    );
  }

  deleteExpense(
    id: string
  ): Observable<void> {
    return this.http.delete<void>(
      `http://localhost:3000/expenses/${id}`
    );
  }
}