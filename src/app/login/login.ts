
import { Component, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../services/auth';

interface RegisteredUser {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm = new FormGroup({
    email: new FormControl<string>(
      '',
      [
        Validators.required,
        Validators.email
      ]
    ),
    password: new FormControl<string>(
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    )
  });

  errorMessage = '';

  readonly demoAccounts = [
    {
      email: 'user1@gmail.com',
      password: 'user123',
      userId: 'user1'
    },
    {
      email: 'user2@gmail.com',
      password: 'user123',
      userId: 'user2'
    },
    {
      email: 'admin@gmail.com',
      password: 'admin123',
      userId: 'admin1'
    }
  ];

  login(): void {

    if (this.loginForm.invalid) {
      this.errorMessage =
        'Please enter a valid email and password.';
      return;
    }

    const email =
      this.loginForm.getRawValue().email?.trim().toLowerCase();

    const password =
      this.loginForm.getRawValue().password;

    if (!email || !password) {
      this.errorMessage =
        'Please enter your email and password.';
      return;
    }

    const demoAccount = this.demoAccounts.find(account => {
      return (
        account.email === email &&
        account.password === password
      );
    });

    if (demoAccount) {
      this.authService.switchUser(demoAccount.userId);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUserId', demoAccount.userId);

      this.errorMessage = '';
      this.router.navigate(['/expenses']);
      return;
    }

    const savedUsers = localStorage.getItem('signupUsers');

    if (savedUsers === null) {
      this.errorMessage =
        'No account found. Please sign up first.';
      return;
    }

    try {
      const users: RegisteredUser[] = JSON.parse(savedUsers);

      const registeredUser = users.find(user => {
        return (
          user.email.toLowerCase() === email &&
          user.password === password
        );
      });

      if (!registeredUser) {
        this.errorMessage = 'Invalid email or password.';
        return;
      }

      this.errorMessage = '';

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUserId', email);

      // Registered accounts must be treated as normal users.
      // Their expense ownership needs to use this unique ID.
      this.router.navigate(['/dashboard']);

    } catch {
      this.errorMessage =
        'Unable to read registered accounts. Please sign up again.';
    }
  }
}
