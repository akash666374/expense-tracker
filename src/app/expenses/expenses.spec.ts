
import { TestBed } from '@angular/core/testing';
import { Expenses } from './expenses';
import { ExpenseService } from '../services/expense';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Expenses', () => {

  let component: Expenses;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expenses],
      providers: [
        {
          provide: ExpenseService,
          useValue: {
            expenses: signal([]),
            getExpenses: vi.fn(() => of([]))
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(Expenses);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getExpenses', () => {
    const service = TestBed.inject(ExpenseService);

    component.getExpenses();

    expect(service.getExpenses).toHaveBeenCalled();
  });

});
