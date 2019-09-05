import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appJobSchema } from '../../schema/appJobSchema';
import { RecruiterService } from './recruiter.service';
import { StudentService } from '../student/student.service';
import { AppService } from '../app.service';
import { appStudentSchema } from 'src/schema/appStudentSchema';
import { appUserSchema } from 'src/schema/appUserSchema';

@Component({
  selector: 'app-recruiter',
  templateUrl: './recruiter.component.html',
  styleUrls: ['./recruiter.component.css']
})
export class RecruiterComponent implements OnInit {

  appJobs: appJobSchema[] = [];
  displayJobs: appJobSchema[] = [];
  foundJobInfo: appJobSchema[] = [];
  isEditJob: boolean = false;
  isNewJob: boolean = false;
  showJobApplicants: boolean = false;
  showApplicant: boolean = false;
  showJobs: boolean = true;
  applicantJobInfo: appStudentSchema = null;
  applicantInfo: appUserSchema = null;
  jobApplicants: appStudentSchema[] = [];

  jobId: String = null;
  title: String = null;
  company: String = null;
  type: String = null;
  salary: String = null;
  location: String = null;
  description: String = null;
  qualification: String = null;
  recruiter: string = null;

  errorMessage: string;
  hasError: boolean = false;

  isSessionActive: boolean;
  isLoggedIn: boolean;
  sessionUser: string;
  tableHeaders = ['Job Title', 'Applicant Name', 'Applicant Qualification', 'View Applicant ?', 'Reject Applicant ?'];

  constructor(private router: Router,
    private recruiterService: RecruiterService,
    private studentService: StudentService,
  ) { }

  ngOnInit() {

    if (sessionStorage.getItem("sessionUser") !== null) {
      this.sessionUser = sessionStorage.getItem("sessionUser");
      this.recruiter = this.sessionUser;
      this.getAllJobs();
    } else {
      this.recruiter = null;
      this.router.navigate(['']);
    }

  }

  async getAllJobs() {
    await this.recruiterService.getAllJobs()
      .subscribe(appJobs => {
        this.getJobsToBeDisplayed(appJobs);
      });
  }

  getJobsToBeDisplayed(allJobs) {
    allJobs.forEach(job => {
      if (job.recruiter === this.sessionUser) {
        this.displayJobs.push(job);
      }
    });
  }

  populateEditJob(jobId) {
    this.isEditJob = true;
    this.showJobs = false;
    this.foundJobInfo = [];
    this.foundJobInfo.push(this.displayJobs.find(function (foundJob) {
      return foundJob._id === jobId;
    }));

    this.jobId = this.foundJobInfo[0]._id;
    this.title = this.foundJobInfo[0].title;
    this.company = this.foundJobInfo[0].company;
    this.type = this.foundJobInfo[0].type;
    this.salary = this.foundJobInfo[0].salary;
    this.location = this.foundJobInfo[0].location;
    this.description = this.foundJobInfo[0].description;
    this.qualification = this.foundJobInfo[0].qualification;
  }

  saveEditedJob(form) {
    let formValue = form.value;
    let editedJob: appJobSchema = {
      _id: this.foundJobInfo[0]._id,
      title: this.foundJobInfo[0].title,
      company: this.foundJobInfo[0].company,
      type: formValue.type,
      salary: formValue.salary,
      location: formValue.location,
      description: formValue.description,
      qualification: formValue.qualification,
      recruiter: this.recruiter
    };
    this.recruiterService.editJob(editedJob)
      .subscribe(response => {
        if ("Ok".includes(response.status)) {
          this.errorMessage = null;
          this.hasError = false;
          this.cancel();
          this.displayJobs = [];
          this.getAllJobs();
        } else {
          this.errorMessage = response.response;
          this.hasError = true;
        }
      })
  }

  showApplicants(jobId) {
    this.isEditJob = false;
    this.isNewJob = false;
    this.showJobs = false;
    this.showJobApplicants = true;
    this.showApplicant = false;
    this.jobApplicants = [];
    this.getAllApplicants(jobId);
  }

  async getAllApplicants(jobId) {
    await this.recruiterService.getAppliedJobs(jobId).subscribe(applicants => {
      this.jobApplicants = applicants;
    })
  }

  async viewApplicant(applicantId, jobId) {
    this.isEditJob = false;
    this.isNewJob = false;
    this.showJobs = false;
    this.showJobApplicants = false;
    this.applicantJobInfo = null;
    this.applicantInfo = null;
    await this.getApplicantInfo(applicantId);
    await this.getApplicantJobInfo(applicantId, jobId);
  }

  async getApplicantInfo(studentId) {
    await this.recruiterService.getApplicantInfo(studentId).subscribe(applicant => {
      this.applicantInfo = applicant;
    })
  }

  async getApplicantJobInfo(studentId, jobId) {
    await this.studentService.getAppliedJobs(studentId).subscribe(appliedJobs => {
      appliedJobs.forEach(job => {
        if ((job.studentId.includes(studentId)) && (job.jobId.includes(jobId))) {
          this.applicantJobInfo = job;
          this.showApplicant = true;
        }
      })
    })
  }

  //ToDo: Needs more work
  async rejectAppliedJob(appliedJobId, applicantFirstName, applicantLastName, applicantEmail) {
    this.jobApplicants = [];
    await this.studentService.deleteAppliedJob(appliedJobId)
      .subscribe(async response => {
        if ("Ok".includes(response.status)) {
          this.showJobApplicants = true;
          await this.getAllApplicants(appliedJobId);
        }
      })
  }

  acceptAppliedJob(applicantFirstName, applicantLastName, applicantEmail) {
    console.log("ApplFirstName:", applicantFirstName);
    console.log("ApplLastName:", applicantLastName);
    console.log("ApplEmail:", applicantEmail);
  }

  deleteJob(deletedJobId) {
    let newDisplayJobsList: appJobSchema[] = [];
    this.recruiterService.deleteJob(deletedJobId)
      .subscribe(response => {
        if ("Ok".includes(response.status)) {
          this.displayJobs = [];
          this.getAllJobs();
        }
      })
  }

  storeJob(form) {
    const formValue = form.value;
    let newJob: appJobSchema = {
      title: formValue.title,
      company: formValue.company,
      type: formValue.type,
      salary: formValue.salary,
      location: formValue.location,
      description: formValue.description,
      qualification: formValue.qualification,
      recruiter: this.recruiter
    }
    this.recruiterService.storeJob(newJob).subscribe(job => {
      this.isEditJob = false;
      this.isNewJob = false;
      this.displayJobs = [];
      this.getAllJobs();
    })
  }

  createNewJob() {
    this.isEditJob = false;
    this.isNewJob = true;
    this.showJobs = false;
    this.showJobApplicants = false;
  }

  resetPage() {
    this.title = null;
    this.company = null;
    this.type = null;
    this.salary = null;
    this.location = null;
    this.description = null;
    this.qualification = null;
    this.recruiter = null;
  }

  cancel() {
    this.isEditJob = false;
    this.isNewJob = false;
    this.showJobs = true;
    this.showJobApplicants = false;
    this.resetPage();
  }

  cancelList() {
    this.isEditJob = false;
    this.isNewJob = false;
    if (this.showApplicant) {
      this.showJobApplicants = true;
      this.showApplicant = false;
      this.showJobs = false;
    } else if (this.showJobApplicants) {
      this.showJobApplicants = false;
      this.showJobs = true;
      this.showApplicant = false;
    }
  }

}
