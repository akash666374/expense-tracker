import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';
import { ExpenseService } from './expense';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpenseService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate total expenses', () => {
    service.expenses.set([
      {
        id: '1',
        name: 'Food',
        amount: 200,
        category: 'Food',
        date: '2026-10-01'
      },
      {
        id: '2',
        name: 'Travel',
        amount: 300,
        category: 'Travel',
        date: '2026-10-02'
      },
      {
        id: '3',
        name: 'Shopping',
        amount: 100,
        category: 'Shopping',
        date: '2026-10-03'
      }
    ]);

    console.log('Total Expenses:', service.totalExpenses());
    expect(service.totalExpenses()).toBe(600);
  });

  it('should return the highest expense', () => {
    service.expenses.set([
      {
        id: '1',
        name: 'Food',
        amount: 200,
        category: 'Food',
        date: '2026-10-01'
      },
      {
        id: '2',
        name: 'Travel',
        amount: 300,
        category: 'Travel',
        date: '2026-10-02'
      },
      {
        id: '3',
        name: 'Shopping',
        amount: 100,
        category: 'Shopping',
        date: '2026-10-03'
      }
    ]);

    console.log('Highest Expense:', service.highestExpense());
    expect(service.highestExpense()).toBe(300);
  });

  it('should calculate totals for each category', () => {
    service.expenses.set([
      {
        id: '1',
        name: 'Lunch',
        amount: 200,
        category: 'Food',
        date: '2026-10-01'
      },
      {
        id: '2',
        name: 'Dinner',
        amount: 300,
        category: 'Food',
        date: '2026-10-02'
      },
      {
        id: '3',
        name: 'Bus',
        amount: 100,
        category: 'Travel',
        date: '2026-10-03'
      }
    ]);

    console.log('Category Totals:', service.categoryTotals());

    expect(service.categoryTotals()).toEqual([
      { amount: 500, category: 'Food' },
      { amount: 100, category: 'Travel' }
    ]);
  });

  it('should fetch expenses', () => {
    const mockExpenses = [
      {
        id: '1',
        name: 'Food',
        amount: 200,
        category: 'Food',
        date: '2026-10-01'
      },
      {
        id: '2',
        name: 'Travel',
        amount: 300,
        category: 'Travel',
        date: '2026-10-02'
      }
    ];

    service.getExpenses().subscribe((expenses) => {
      expect(expenses).toEqual(mockExpenses);
      expect(service.expenses()).toEqual(mockExpenses);
    });

    const request = httpMock.expectOne(
      'http://localhost:3000/expenses'
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockExpenses);
  });

  it('should add an expense', () => {
    const newExpense = {
      id: '3',
      name: 'Shopping',
      amount: 400,
      category: 'Shopping',
      date: '2026-10-03'
    };

    service.addExpense(newExpense).subscribe((expense) => {
      expect(expense).toEqual(newExpense);
    });

    const request = httpMock.expectOne(
      'http://localhost:3000/expenses'
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newExpense);

    request.flush(newExpense);
  });
});
