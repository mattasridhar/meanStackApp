import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _isUserLogged = new BehaviorSubject<boolean>(false);

  isLogged$ = this._isUserLogged.asObservable();

  constructor() { }

  toggleLogOut(isLoggedIn) {
    this._isUserLogged.next(isLoggedIn);
  }
}
