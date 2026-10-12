import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';

import { Navbar } from '../navbar/navbar';

import { MatIconModule }
  from '@angular/material/icon';

import { MatButtonModule }
  from '@angular/material/button';


@Component({
  selector: 'app-about',

  imports: [
    Navbar,
    RouterLink,
    MatIconModule,
    MatButtonModule
  ],

  templateUrl: './about.html',

  styleUrl: './about.css'
})
export class About {

  features = [

    {
      icon: 'dashboard',
      title: 'Smart Dashboard',
      description:
        'View your total spending, number of expenses and highest expense in one place.'
    },

    {
      icon: 'category',
      title: 'Category Tracking',
      description:
        'Organize your expenses into categories such as Food, Travel, Shopping and Bills.'
    },

    {
      icon: 'search',
      title: 'Quick Search',
      description:
        'Find expenses quickly using the search and category filters.'
    },

    {
      icon: 'edit',
      title: 'Easy Editing',
      description:
        'Update your expense details whenever you need to make a correction.'
    },

    {
      icon: 'delete',
      title: 'Simple Management',
      description:
        'Delete expenses that you no longer want to keep in your records.'
    },

    {
      icon: 'bar_chart',
      title: 'Visual Insights',
      description:
        'Understand your spending with simple summaries and visual information.'
    }

  ];

}