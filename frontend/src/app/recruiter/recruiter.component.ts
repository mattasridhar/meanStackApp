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
      console.log("Recruit sessionUser: ", sessionStorage.getItem("sessionUser"));
      this.sessionUser = sessionStorage.getItem("sessionUser");
      this.recruiter = this.sessionUser;
      this.getAllJobs();
    } else {
      console.log("Recruit ELSE sessionUser: ", sessionStorage.getItem("sessionUser"));
      this.recruiter = null;
      this.router.navigate(['']);
    }

  }

  async getAllJobs() {
    await this.recruiterService.getAllJobs()
      .subscribe(appJobs => {
        console.log(appJobs);
        this.getJobsToBeDisplayed(appJobs);
      });
  }

  getJobsToBeDisplayed(allJobs) {
    // console.log("Sess: ", allJobs);
    allJobs.forEach(job => {
      // console.log("Job Recrut: " + job.recruiter);
      // console.log((job.recruiter === this.sessionUser));
      if (job.recruiter === this.sessionUser) {
        // console.log("Job ID: ", job._id);
        // console.log("Job Value: ", job.value);
        this.displayJobs.push(job);
      }
    });
  }

  populateEditJob(jobId) {
    // console.log("ID", document.getElementById('jobId').innerText);
    this.isEditJob = true;
    this.showJobs = false;
    this.foundJobInfo = [];
    this.foundJobInfo.push(this.displayJobs.find(function (foundJob) {
      // console.log("VALUE", jobId);
      // console.log("VALUE FOUND", foundJob._id);
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

    console.log(this.foundJobInfo);
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
        console.log("RespEdit: ", response);
        if ("Ok".includes(response.status)) {
          this.errorMessage = null;
          this.hasError = false;
          this.cancel();
          this.displayJobs = [];
          this.getAllJobs();
          // this.router.navigate(['/recruiter']);
        } else {
          this.errorMessage = response.response;
          this.hasError = true;
        }
      })
    // console.log("EditedJob: ", editedJob);
  }

  showApplicants(jobId) {
    console.log("JobId:", jobId);
    this.isEditJob = false;
    this.isNewJob = false;
    this.showJobs = false;
    this.showJobApplicants = true;
    this.showApplicant = false;
    this.jobApplicants = [];
    this.getAllApplicants(jobId);
    console.log("appls: ", this.jobApplicants);
  }

  async getAllApplicants(jobId) {
    await this.recruiterService.getAppliedJobs(jobId).subscribe(applicants => {
      this.jobApplicants = applicants;
    })
  }

  async viewApplicant(applicantId, jobId) {
    console.log("applicantId:", applicantId);
    console.log("jobId:", jobId);
    this.isEditJob = false;
    this.isNewJob = false;
    this.showJobs = false;
    this.showJobApplicants = false;
    // this.showApplicant = true;
    this.applicantJobInfo = null;
    this.applicantInfo = null;
    // this.jobApplicants = [];
    await this.getApplicantInfo(applicantId);
    await this.getApplicantJobInfo(applicantId, jobId);
    // console.log("ApplicantJobInfo: ", this.applicantJobInfo);
    // console.log("ApplicantInfo: ", this.applicantInfo);
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
    console.log("DELETED ApplFirstName:", applicantFirstName);
    console.log("DELETED ApplLastName:", applicantLastName);
    console.log("DELETED ApplEmail:", applicantEmail);
    console.log("DELETED APPLIED JOBID", appliedJobId);
    this.jobApplicants = [];
    await this.studentService.deleteAppliedJob(appliedJobId)
      .subscribe(async response => {
        // console.log("RESP:", response.status);
        // console.log("RESP Cond:", "Ok".includes(response.status));
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
    console.log("DELETED JOBID", deletedJobId);
    let newDisplayJobsList: appJobSchema[] = [];
    this.recruiterService.deleteJob(deletedJobId)
      .subscribe(response => {
        // console.log("RESP:", response.status);
        // console.log("RESP Cond:", "Ok".includes(response.status));
        if ("Ok".includes(response.status)) {
          /* newDisplayJobsList.push(this.displayJobs.find(function (oldJobs) {
            return oldJobs._id !== deletedJobId;
          })); */
          this.displayJobs = [];
          // this.displayJobs = newDisplayJobsList;
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
      console.log("New Job ID: ", job._id);
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
