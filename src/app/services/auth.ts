
import { Injectable, computed, signal } from '@angular/core';

export type UserRole = 'user' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly demoUsers: AppUser[] = [
    { id: 'user1', name: 'User 1', role: 'user' },
    { id: 'user2', name: 'User 2', role: 'user' },
    { id: 'admin1', name: 'Admin', role: 'admin' }
  ];

  readonly currentUser = signal<AppUser>(this.getInitialUser());

  readonly isAdmin = computed(() => {
    return this.currentUser().role === 'admin';
  });

  private getInitialUser(): AppUser {
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    if (loggedInUserId !== null) {
      const savedUser = this.demoUsers.find((user) => {
        return user.id === loggedInUserId;
      });

      if (savedUser !== undefined) {
        return savedUser;
      }
    }

    return this.demoUsers[0];
  }

  switchUser(userId: string): void {
    const selectedUser = this.demoUsers.find((user) => {
      return user.id === userId;
    });

    if (selectedUser !== undefined) {
      this.currentUser.set(selectedUser);
      localStorage.setItem('loggedInUserId', selectedUser.id);
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('isLoggedIn');
    this.currentUser.set(this.demoUsers[0]);
  }
}
