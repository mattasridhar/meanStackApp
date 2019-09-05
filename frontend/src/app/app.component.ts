import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

import { SpeechService } from './speech.service';

export let isLoggedIn = true;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MEAN Stack Application';
  isLoggedIn: boolean = true;
  subscription: Subscription;

  constructor(
    private router: Router,
    private appService: AppService,
    public speech: SpeechService,
  ) { }

  ngOnInit() {
    this.subscription = this.appService.isLogged$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn)

    if (sessionStorage.getItem("sessionUser") !== null) {
      this.appService.toggleLogOut(false);
    } else {
      this.appService.toggleLogOut(true);
    }
  }

  contactUs() {
    this.router.navigate(['/contactus']);
  }

  logOut() {
    sessionStorage.setItem("sessionUser", null);
    sessionStorage.setItem("sessionUserId", null);
    this.appService.toggleLogOut(false);
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}

