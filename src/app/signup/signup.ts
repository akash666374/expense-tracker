import { Component, signal } from '@angular/core';

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

  imports: [
    FormField,
    RouterLink
  ],

  templateUrl: './signup.html',

  styleUrl: './signup.css'
})
export class Signup {


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


  constructor(
    private router: Router
  ) { }


  signup() {


    if (this.signupForm().valid()) {


      const user =
        this.signupModel();


      // Saves te registered user

      localStorage.setItem(

        'signupUser',

        JSON.stringify(user)

      );


      console.log(
        'Signup successful'
      );


      this.router.navigate([
        '/login'
      ]);


    } else {


      console.log(
        'Form is invalid'
      );

    }

  }

}