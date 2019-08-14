import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent } from './student/student.component';
import { RecruiterComponent } from './recruiter/recruiter.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

import { SpeechService } from './speech.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    StudentComponent,
    RecruiterComponent,
    ContactUsComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [
    SpeechService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
