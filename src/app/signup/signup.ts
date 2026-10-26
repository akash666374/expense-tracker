
import { Component, signal, inject } from '@angular/core';

import {
  form,
  FormField,
  required,
  email,
  minLength
} from '@angular/forms/signals';

import {
  Router,
  RouterLink
} from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormField,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  private readonly router = inject(Router);

  errorMessage = signal('');
  successMessage = signal('');

  signupModel = signal({
    name: '',
    email: '',
    password: ''
  });

  signupForm = form(
    this.signupModel,
    (schema) => {
      required(schema.name);
      required(schema.email);
      email(schema.email);
      required(schema.password);
      minLength(schema.password, 6);
    }
  );

  signup(): void {

    if (!this.signupForm().valid()) {
      this.errorMessage.set('Please fill in all fields correctly.');
      this.successMessage.set('');
      return;
    }

    const user = this.signupModel();

    const normalizedEmail = user.email.trim().toLowerCase();

    let savedUsers: {
      name: string;
      email: string;
      password: string;
    }[] = [];

    const existingUsers = localStorage.getItem('signupUsers');

    if (existingUsers !== null) {
      try {
        savedUsers = JSON.parse(existingUsers);
      } catch {
        this.errorMessage.set('Unable to read registered accounts.');
        return;
      }
    }

    const emailExists = savedUsers.some(existingUser => {
      return existingUser.email.toLowerCase() === normalizedEmail;
    });

    if (emailExists) {
      this.errorMessage.set('This email is already registered. Please log in.');
      this.successMessage.set('');
      return;
    }

    const newUser = {
      name: user.name.trim(),
      email: normalizedEmail,
      password: user.password
    };

    savedUsers.push(newUser);

    localStorage.setItem(
      'signupUsers',
      JSON.stringify(savedUsers)
    );

    this.errorMessage.set('');
    this.successMessage.set('Signup successful! Please log in.');

    this.router.navigate(['/login']);
  }
}
