import { Component } from '@angular/core';

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


@Component({

  selector: 'app-login',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'

})
export class Login {


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


  constructor(
    private router: Router
  ) { }


  login() {

    // Check form validation
    if (!this.loginForm.valid) {

      this.errorMessage =
        'Please enter valid email and password.';

      return;
    }


    // Get entered email
    const email =
      this.loginForm.value.email;


    // Get entered password
    const password =
      this.loginForm.value.password;


    // Get registered user
    const savedUser =
      localStorage.getItem('signupUser');


    // Check whether user exists
    if (savedUser === null) {

      this.errorMessage =
        'No account found. Please sign up first.';

      return;
    }


    // Convert JSON string into object
    const user =
      JSON.parse(savedUser);


    // Check email and password
    if (
      email === user.email &&
      password === user.password
    ) {

      // Login successful
      localStorage.setItem(
        'isLoggedIn',
        'true'
      );

      this.errorMessage = '';

      console.log('Login successful');

      // Navigate to dashboard
      this.router.navigate([
        '/dashboard'
      ]);

    } else {

      // Login failed
      this.errorMessage =
        'Invalid email or password.';

    }

  }

}