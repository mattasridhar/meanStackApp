import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { appUserSchema } from '../../schema/appUserSchema';
import { LoginService } from './login.service';

import { AppService } from '../app.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  //initializing
  appUsers: appUserSchema[] = [];
  sessionUser: appUserSchema;
  redirectToMainPage: Boolean = false;
  isLogin: Boolean = true;
  errorMessage: String = "";
  hasError: Boolean = false;

  firstname: String = null;
  lastname: String = null;
  email: String = null;
  contact: Number = null;
  address: String = null;
  isAdmin: Boolean = false;
  isRecruiter: Boolean = false;
  isStudent: Boolean = false;
  referrerName: String = null;
  username: String = null;
  password: String = null;
  verifyPassword: String = null;

  userType: string = "";

  constructor(
    private loginService: LoginService,
    private appService: AppService,
    private router: Router,
  ) { }

  ngOnInit() {
    sessionStorage.setItem("sessionUser", null);
    sessionStorage.setItem("sessionUserId", null);
    this.getUsers();
  }

  getUsers() {
    this.loginService.getUsers()
      .subscribe(appUsers => {
        this.appUsers = appUsers;
      });
  }

  loginUser(form) {
    this.redirectToMainPage = false;
    this.isLogin = true;
    this.getUsers();
    this.appUsers.forEach(user => {
      if ((user.username === form.value.username) && !this.redirectToMainPage) {
        if (user.password === form.value.password) {
          this.sessionUser = user;
          this.redirectToMainPage = true;
        }
      }
    });
    if (this.redirectToMainPage) {
      sessionStorage.setItem("sessionUser", this.sessionUser.username.toString());
      sessionStorage.setItem("sessionUserId", this.sessionUser._id.toString());
      this.appService.toggleLogOut(true);
      if (this.sessionUser.isRecruiter && this.sessionUser.isAdmin) {
        this.router.navigate(['/recruiter']);
      } else if (this.sessionUser.isAdmin) {
        this.router.navigate(['/admin']);
      } else if (this.sessionUser.isRecruiter) {
        this.router.navigate(['/recruiter']);
      } else if (this.sessionUser.isStudent) {
        this.router.navigate(['/student']);
      }
    } else {
      this.resetPage();
      this.appService.toggleLogOut(false);
      this.hasError = true;
      this.errorMessage = "Incorrect Username and Password. Please Login with correct credentials";
    }
  }

  registerUser(form) {
    this.resetPage();
    this.isLogin = false;
    this.hasError = false;
    let formValue = form.value;
    if (!(formValue.username === "") && (formValue.password === formValue.verifyPassword)) {
      console.log("Saving new User");
      let newUser: appUserSchema = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        email: formValue.email,
        contact: formValue.contact,
        isAdmin: formValue.isAdmin,
        isRecruiter: formValue.isRecruiter,
        isStudent: formValue.isStudent,
        referrerName: formValue.referrerName,
        address: formValue.address,
        username: formValue.username,
        password: formValue.password
      };

      this.loginService.addUser(newUser).subscribe(user => {
        this.getUsers();
      });
    }

  }

  resetPage() {
    this.firstname = "";
    this.lastname = "";
    this.email = "";
    this.contact = null;
    this.address = "";
    this.isAdmin = false;
    this.isRecruiter = false;
    this.isStudent = false;
    this.referrerName = "";
    this.username = "";
    this.password = "";
    this.verifyPassword = "";
    this.errorMessage = "";
    this.hasError = false;
  }

  cancel() {
    this.resetPage();
    this.isLogin = true;
    this.errorMessage = "";
    this.hasError = false;
  }

}
