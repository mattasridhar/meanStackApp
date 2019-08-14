import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent } from './student/student.component';
import { RecruiterComponent } from './recruiter/recruiter.component';
import { AppComponent } from './app.component';
import { ContactUsComponent } from './contact-us/contact-us.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: AppComponent
  // },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'student',
    component: StudentComponent
  },
  {
    path: 'recruiter',
    component: RecruiterComponent
  },
  {
    path: 'contactus',
    component: ContactUsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
