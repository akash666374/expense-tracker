
import {
  Injectable,
  signal,
  computed,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';

export interface Expense {
  id: number;
  userId: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  createdBy: string;
  modifiedBy: string;
}

export interface ExpenseData {
  id?: number;
  userId: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  createdBy: string;
  modifiedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/expenses';

  readonly expenses = signal<Expense[]>([]);
  readonly searchText = signal('');
  readonly selectedCategory = signal('');

  readonly filteredExpenses = computed(() => {
    const expenses = this.expenses();
    const search = this.searchText().trim().toLowerCase();
    const category = this.selectedCategory();

    return expenses.filter((expense) => {
      const matchesName = expense.name.toLowerCase().includes(search);

      let matchesCategory = true;

      if (category !== '') {
        matchesCategory = expense.category === category;
      }

      return matchesName && matchesCategory;
    });
  });

  readonly totalExpenses = computed(() => {
    return this.filteredExpenses().reduce((total, expense) => {
      return total + Number(expense.amount);
    }, 0);
  });

  readonly highestExpense = computed(() => {
    return this.filteredExpenses().reduce((highest, expense) => {
      return Math.max(highest, Number(expense.amount));
    }, 0);
  });

  readonly categoryTotals = computed(() => {
    const totals: { category: string; amount: number }[] = [];

    this.filteredExpenses().forEach((expense) => {
      const existing = totals.find((item) => {
        return item.category === expense.category;
      });

      if (existing !== undefined) {
        existing.amount += Number(expense.amount);
      } else {
        totals.push({
          category: expense.category,
          amount: Number(expense.amount)
        });
      }
    });

    return totals;
  });

  readonly categoryChart = computed(() => {
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

  getExpenses(userId?: string): Observable<Expense[]> {
    let params = new HttpParams();

    if (userId !== undefined) {
      params = params.set('userId', userId);
    }

    return this.http.get<Expense[]>(this.apiUrl, { params }).pipe(
      tap((data) => {
        let visibleExpenses = data;

        if (userId !== undefined) {
          visibleExpenses = data.filter((expense) => {
            return expense.userId === userId;
          });
        }

        this.expenses.set(visibleExpenses);
      })
    );
  }

  searchExpenses(
    searchText: string,
    userId?: string
  ): Observable<Expense[]> {
    let params = new HttpParams();

    if (searchText.trim() !== '') {
      params = params.set('name:contains', searchText.trim());
    }

    if (userId !== undefined) {
      params = params.set('userId', userId);
    }

    return this.http.get<Expense[]>(this.apiUrl, { params }).pipe(
      tap((data) => {
        let visibleExpenses = data;

        if (userId !== undefined) {
          visibleExpenses = data.filter((expense) => {
            return expense.userId === userId;
          });
        }

        this.expenses.set(visibleExpenses);
      })
    );
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }

  addExpense(expense: ExpenseData): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  updateExpense(
    id: number,
    expense: Partial<ExpenseData>
  ): Observable<Expense> {
    return this.http.patch<Expense>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      expense
    );
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }

  setSearchText(searchText: string): void {
    this.searchText.set(searchText);
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedCategory.set('');
  }
}
