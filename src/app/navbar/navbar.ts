import {
  Component,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { MatToolbarModule }
  from '@angular/material/toolbar';

import { MatButtonModule }
  from '@angular/material/button';

import { MatIconModule }
  from '@angular/material/icon';

import { MatSnackBarModule }
  from '@angular/material/snack-bar';

import { MatSnackBar }
  from '@angular/material/snack-bar';

import { MatButtonToggleModule }
  from '@angular/material/button-toggle';


@Component({
  selector: 'app-navbar',

  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonToggleModule
  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  menuOpen = signal(false);

  profileOpen = signal(false);

  showProfile = false;

  isActive = true;

  showPersonalization = false;

  currency = '₹';

  showTotalExpenses = true;

  showNumberOfExpenses = true;

  showHighestExpense = true;

  defaultView = 'All Expenses';

  showHelp = false;

  showSettings = false;

  darkMode = false;

  notifications = true;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) { }


  toggleMenu() {

    this.menuOpen.set(
      !this.menuOpen()
    );

  }


  closeMenu() {

    this.menuOpen.set(false);

  }


  toggleProfile() {

    this.profileOpen.set(
      !this.profileOpen()
    );

    if (!this.profileOpen()) {

      this.showProfile = false;

      this.showPersonalization = false;

      this.showHelp = false;

      this.showSettings = false;

    }

  }


  toggleDarkMode() {

    this.darkMode =
      !this.darkMode;

    document.body.classList.toggle(
      'dark-mode',
      this.darkMode
    );

  }


  openProfile() {

    this.showProfile = true;

    this.showPersonalization = false;

    this.showHelp = false;

    this.showSettings = false;

  }


  closeProfile() {

    this.showProfile = false;

  }


  openPersonalization() {

    this.showPersonalization = true;

    this.showProfile = false;

    this.showHelp = false;

    this.showSettings = false;

  }


  closePersonalization() {

    this.showPersonalization = false;

  }


  openHelp() {

    this.showHelp = true;

    this.showProfile = false;

    this.showPersonalization = false;

    this.showSettings = false;

  }


  closeHelp() {

    this.showHelp = false;

  }


  openSettings() {

    this.showSettings = true;

    this.showProfile = false;

    this.showPersonalization = false;

    this.showHelp = false;

  }


  closeSettings() {

    this.showSettings = false;

  }


  changeTheme(theme: string) {

    if (theme === 'dark') {

      this.darkMode = true;

    } else {

      this.darkMode = false;

    }

    document.body.classList.toggle(
      'dark-mode',
      this.darkMode
    );

  }


  changeNotifications(value: string) {

    if (value === 'on') {

      this.notifications = true;

    } else {

      this.notifications = false;

    }

  }


  goToDashboard() {

    this.closeMenu();

    this.router.navigate([
      '/dashboard'
    ]);

  }


  goToExpenses() {

    this.closeMenu();

    this.router.navigate([
      '/expenses'
    ]);

  }


  goToAbout() {

    this.closeMenu();

    this.router.navigate([
      '/about'
    ]);

  }


  logout() {

    const snackBarRef =
      this.snackBar.open(

        'Are you sure you want to logout?',

        'Logout',

        {
          duration: 5000,

          horizontalPosition: 'center',

          verticalPosition: 'bottom'
        }

      );

    snackBarRef
      .onAction()
      .subscribe(() => {

        localStorage.removeItem(
          'isLoggedIn'
        );

        this.closeMenu();

        this.profileOpen.set(false);

        this.router.navigate([
          '/login'
        ]);

      });

  }

}