import {
    Routes
} from '@angular/router';

import {
    Login
} from './login/login';

import {
    Signup
} from './signup/signup';

import {
    Dashboard
} from './dashboard/dashboard';

import {
    Expenses
} from './expenses/expenses';

import {
    Reports
} from './reports/reports';

import {
    ExpenseDetails
} from './expense-details/expense-details';

import {
    authGuard
} from './auth-guard';


export const routes: Routes = [


    {
        path: 'login',
        component: Login
    },


    {
        path: 'signup',
        component: Signup
    },


    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },



    {
        path: 'expenses',
        component: Expenses,
        canActivate: [authGuard]
    },



    {
        path: 'reports',
        component: Reports,
        canActivate: [authGuard]
    },



    {
        path: 'expense/:id',
        component: ExpenseDetails,
        canActivate: [authGuard]
    },


    // ABOUT  lazy loading
    {
        path: 'about',
        loadComponent: () =>
            import('./about/about')
                .then(m => m.About),
        canActivate: [authGuard]
    },



    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }

];

