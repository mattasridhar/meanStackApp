import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _URL = 'http://localhost:1990/serve/';

  constructor(private http: Http) { }

  getUsers() {
    return this.http.get(`${this._URL}getUsers`)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  addUser(newUser) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this._URL}addUser`, newUser, { headers: headers })
      .pipe(
        map(
          result => result.json()
        )
      );

  }
}
