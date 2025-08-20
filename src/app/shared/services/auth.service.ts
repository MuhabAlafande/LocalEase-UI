import { inject, Injectable } from '@angular/core';
import { IUser } from '../models/IUser';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { LoaderService } from '../components/loader/loader.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loaderServices = inject(LoaderService);
  private readonly usersService = inject(UsersService);
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private readonly currentUserIdSubject = new BehaviorSubject<
    string | undefined
  >(undefined);

  constructor(private readonly auth: Auth) {}

  getCurrentUserId() {
    onAuthStateChanged(this.auth, (user) =>
      this.currentUserIdSubject.next(user?.uid),
    );

    return this.currentUserIdSubject.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    onAuthStateChanged(this.auth, (user) =>
      this.isLoggedInSubject.next(!!user),
    );
    return this.isLoggedInSubject.asObservable();
  }

  registerUser(user: IUser, password: string) {
    this.loaderServices.show();
    return from(
      createUserWithEmailAndPassword(this.auth, user.email, password)
        .then(() => {
          this.signIn({ email: user.email, password: password }).subscribe({
            next: async () => {
              user.id = this.auth.currentUser!.uid;
              await this.usersService.saveUser(user);
            },
          });
        })
        .catch((err) => console.log(err))
        .finally(() => this.loaderServices.hide()),
    );
  }

  signIn(user: { email: string; password: string }) {
    this.loaderServices.show();
    return from(
      signInWithEmailAndPassword(this.auth, user.email, user.password)
        .then(() => this.loaderServices.hide())
        .catch(() => this.loaderServices.hide()),
    );
  }

  async signOut() {
    return await this.auth.signOut();
  }
}
