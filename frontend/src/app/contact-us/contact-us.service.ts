import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { resource } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private _URL = 'http://localhost:8089/contactus/';

  constructor(private http: Http) { }

  testConnection() {
    return this.http.get(`${this._URL}testConcerns`)
      .pipe(map(result => result));
  }

  getAllConcerns() {
    return this.http.get(`${this._URL}getAllConcerns`)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  getSearchResponse(searchConcern) {
    console.log("Search Service: " + searchConcern);
    return this.http.get(`${this._URL}getSearchResponse/` + searchConcern)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  getShowResponse(showConcern) {
    console.log("Show Service: " + showConcern);
    return this.http.get(`${this._URL}getShowResponse/` + showConcern)
      .pipe(
        map(
          result => result.json()
        )
      );
  }
}
