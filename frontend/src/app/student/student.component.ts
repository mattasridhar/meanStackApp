import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appJobSchema } from '../../schema/appJobSchema';
import { appStudentSchema } from '../../schema/appStudentSchema';
import { RecruiterService } from '../recruiter/recruiter.service';
import { StudentService } from './student.service';
import { AppService } from '../app.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  displayJobs: appJobSchema[] = [];
  appliedJobs: appStudentSchema[] = [];
  jobInfo: appJobSchema = null;
  isApplyJob: boolean = false;
  showInfo: boolean = false;
  showJobs: boolean = true;
  showAppliedJobs: boolean = false;

  jobId: String = null;
  studentId: String = null;
  userId: String = null;
  title: String = null;
  contact: String = null;
  email: String = null;
  address: String = null;
  about: String = null;
  qualification: String = null;
  student: string = null;
  studentName: string = null;
  company: string = null;

  errorMessage: string;
  hasError: boolean = false;

  isSessionActive: boolean;
  isLoggedIn: boolean;
  sessionUser: string;

  tableHeaders = ['Job Title', 'Organization', 'Delete Applied Job ?'];

  constructor(private router: Router,
    private recruiterService: RecruiterService,
    private studentService: StudentService,
  ) { }

  ngOnInit() {

    if (sessionStorage.getItem("sessionUser") !== null) {
      console.log("Student sessionUser: ", sessionStorage.getItem("sessionUserId"));
      this.sessionUser = sessionStorage.getItem("sessionUser");
      this.getSessionUserInfo(sessionStorage.getItem("sessionUserId"));
      this.student = this.sessionUser;
      this.getAllJobs();
    } else {
      console.log("Recruit ELSE sessionUser: ", sessionStorage.getItem("sessionUser"));
      this.student = null;
      this.router.navigate(['']);
    }

  }

  async getSessionUserInfo(sessionUserId) {
    await this.studentService.getSessionUser(sessionUserId)
      .subscribe(foundUser => {

        if (foundUser !== null) {
          this.studentId = foundUser._id;
          this.studentName = foundUser.firstname + "  " + foundUser.lastname;
        }
        console.log("StudentName: ", foundUser);
      })
  }

  async getAllJobs() {
    await this.studentService.getAllJobs()
      .subscribe(appJobs => {
        console.log(appJobs);
        this.displayJobs = appJobs;
      });
  }

  populateJob(jobId) {
    console.log("ID", jobId);
    this.isApplyJob = true;
    this.showInfo = false;
    this.showJobs = false;
    this.showAppliedJobs = false;
    this.jobInfo = null;
    this.jobInfo = this.displayJobs.find(function (foundJob) {
      console.log("VALUE", jobId);
      // console.log("VALUE FOUND", foundJob._id);
      return foundJob._id === jobId;
    });

    this.jobId = this.jobInfo._id;
    this.title = this.jobInfo.title;
    this.qualification = this.jobInfo.qualification;
    this.company = this.jobInfo.company;
    this.student = this.sessionUser;

    console.log(this.jobInfo);
  }

  saveAppliedJob(form) {
    /* console.log("title: ", this.title);
    console.log("jobId: ", this.jobId);
    console.log("student: ", this.student);
    console.log("company: ", this.company); */
    console.log("our appliedJob stuName: ", this.studentId);
    let formValue = form.value;
    let studentIdInfo = this.studentId;
    let studentNameInfo = this.studentName;
    let appliedJob: appStudentSchema = {
      title: this.title.toString(),
      jobId: this.jobId.toString(),
      studentId: this.studentId.toString(),
      company: this.company,
      student: this.student,
      contact: formValue.contact,
      email: formValue.email,
      address: formValue.address,
      about: formValue.about,
      qualification: formValue.qualification
    };

    this.studentService.applyJob(appliedJob)
      .subscribe(response => {
        if ("Ok".includes(response.status)) {
          this.errorMessage = null;
          this.hasError = false;
          this.cancel();
          this.studentName = studentNameInfo;
          this.studentId = studentIdInfo;
          // this.getAllJobs();
          // this.router.navigate(['/recruiter']);
          // console.log("appliedJob stuName: ", this.studentName);
        } else {
          this.errorMessage = response.response;
          this.hasError = true;
        }
      });
  }

  appliedJobStatus() {
    console.log("StudntId", this.studentId);
    this.isApplyJob = false;
    this.showInfo = false;
    this.showJobs = false;
    this.showAppliedJobs = true;
    this.getAppliedJobs(this.studentId);
  }

  async getAppliedJobs(studentId) {
    await this.studentService.getAppliedJobs(studentId).subscribe(allAppliedJobs => {
      this.appliedJobs = allAppliedJobs;
      console.log("appliedJobs: ", this.appliedJobs);
    });
  }

  async deleteAppliedJob(jobId) {
    console.log("JobId:", jobId);
    console.log("delete StudntId", this.studentId);
    this.appliedJobs = [];
    await this.studentService.deleteAppliedJob(jobId).subscribe(respStatus => {
      if ("Ok".includes(respStatus.status)) {
        this.getAppliedJobs(this.studentId);
      }
    });
  }

  showJobInfo(jobId) {
    this.showJobs = false;
    this.showAppliedJobs = false;
    this.showInfo = true;
    this.isApplyJob = false;
    this.jobInfo = this.displayJobs.find(function (foundJob) {
      console.log("VALUE", jobId);
      // console.log("VALUE FOUND", foundJob._id);
      return foundJob._id === jobId;
    });
  }

  resetPage() {
    this.title = null;
    this.contact = null;
    this.email = null;
    this.address = null;
    this.about = null;
    this.qualification = null;
    // this.student = null;
  }

  cancel() {
    this.isApplyJob = false;
    this.showInfo = false;
    this.showJobs = true;
    this.showAppliedJobs = false;
    this.resetPage();
  }


}
