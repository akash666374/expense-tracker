import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { ExpenseService } from '../services/expense';

import { Navbar } from '../navbar/navbar';

import { MatCardModule }
  from '@angular/material/card';

import { MatIconModule }
  from '@angular/material/icon';


@Component({
  selector: 'app-dashboard',

  imports: [
    Navbar,
    MatCardModule,
    MatIconModule
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  expenseService =
    inject(ExpenseService);


  ngOnInit() {

    this.expenseService
      .getExpenses()
      .subscribe({
        next: (data) => {

          this.expenseService
            .expenses
            .set(data);

          console.log(
            'Dashboard expenses:',
            data
          );

        },

        error: (error) => {

          console.log(
            'Failed to load expenses:',
            error
          );

        }
      });

  }

}