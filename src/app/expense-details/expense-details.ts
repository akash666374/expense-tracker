
import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ExpenseService, Expense } from '../services/expense';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expense-details',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './expense-details.html',
  styleUrl: './expense-details.css'
})
export class ExpenseDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  expense: Expense | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    console.log('Expense ID from route:', id);

    if (id === null || id.trim() === '') {
      this.loading = false;
      this.errorMessage = 'Invalid expense ID';
      this.cdr.detectChanges();
      return;
    }

    const expenseId = Number(id);

    if (!Number.isInteger(expenseId) || expenseId <= 0) {
      this.loading = false;
      this.errorMessage = 'Invalid expense ID';
      this.cdr.detectChanges();
      return;
    }

    this.expenseService.getExpenseById(expenseId).subscribe({
      next: (expense: Expense) => {
        console.log('Expense received from API:', expense);

        this.expense = expense;
        this.loading = false;
        this.errorMessage = '';

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load expense details:', error);

        this.expense = null;
        this.loading = false;
        this.errorMessage = 'Expense Not Found';

        this.cdr.detectChanges();
        // ChangeDetectorRef is used to trigger change detection for the view.
      }
    });
  }
}
