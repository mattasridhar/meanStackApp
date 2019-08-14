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
      // console.log("Recruit sessionUser: ", sessionStorage.getItem("sessionUser"));
      this.appService.toggleLogOut(false);
    } else {
      // console.log("Recruit ELSE sessionUser: ", sessionStorage.getItem("sessionUser"));
      this.appService.toggleLogOut(true);
      // this.router.navigate(['']);
    }
  }

  contactUs() {
    this.router.navigate(['/contactus']);
  }

  logOut() {
    sessionStorage.setItem("sessionUser", null);
    sessionStorage.setItem("sessionUserId", null);
    // isLoggedIn = false;
    this.appService.toggleLogOut(false);
    // console.log("LogoutClicked", sessionStorage.getItem("sessionUser"));
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}

