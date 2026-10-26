
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { ExpenseService } from '../services/expense';
import { AuthService } from '../services/auth';
import { Navbar } from '../navbar/navbar';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { catchError, finalize, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Navbar,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  readonly expenseService = inject(ExpenseService);
  readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadDashboard();
  }


  loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const currentUser = this.authService.currentUser();

    let userId: string | undefined;

    if (currentUser.role === 'admin') {
      userId = undefined;
    } else {
      userId = currentUser.id;
    }

    this.expenseService.getExpenses(userId).pipe(
      take(1),
      catchError(error => {
        console.error('Failed to load dashboard expenses:', error);
        this.errorMessage.set('Failed to load dashboard data.');
        return EMPTY;
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }
}
