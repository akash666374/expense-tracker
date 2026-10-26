
import { TestBed } from '@angular/core/testing';
import { ExpenseList } from './expense-list';
import { ExpenseService } from '../services/expense';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

describe('ExpenseList', () => {
  let component: ExpenseList;

  const mockExpenses = [
    {
      id: '1',
      name: 'Food',
      amount: 100,
      category: 'Food',
      date: '2026-10-01'
    },
    {
      id: '2',
      name: 'Travel',
      amount: 200,
      category: 'Travel',
      date: '2026-10-02'
    },
    {
      id: '3',
      name: 'Shopping',
      amount: 300,
      category: 'Shopping',
      date: '2026-10-03'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExpenseList],
      providers: [
        {
          provide: ExpenseService,
          useValue: {
            expenses: vi.fn(() => mockExpenses)
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: vi.fn()
          }
        }
      ]
    });

    const fixture = TestBed.createComponent(ExpenseList);
    component = fixture.componentInstance;
  });

  // 1. Create component
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 2. vi.fn()
  it('should create a mock function', () => {
    const mockFn = vi.fn();

    mockFn('Food');

    expect(mockFn).toHaveBeenCalledWith('Food');
  });

  // 3. vi.spyOn()
  it('should spy on searchExpenses', () => {
    const searchSpy = vi.spyOn(component, 'searchExpenses');

    component.searchExpenses();

    expect(searchSpy).toHaveBeenCalled();

    searchSpy.mockRestore();
  });

  // 4. mockReturnValue()
  it('should return a mocked value', () => {
    const mockFn = vi.fn();

    mockFn.mockReturnValue(100);

    expect(mockFn()).toBe(100);
  });

  // 5. mockImplementation()
  it('should replace the search method implementation', () => {
    const searchSpy = vi.spyOn(component, 'searchExpenses');

    searchSpy.mockImplementation(() => []);

    expect(component.searchExpenses()).toEqual([]);

    searchSpy.mockRestore();
  });
});
