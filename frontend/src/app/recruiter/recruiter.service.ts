import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  private _UserURL = 'http://localhost:1990/serve/';
  private _RecruiterURL = 'http://localhost:1990/recruiter/';
  private _StudentURL = 'http://localhost:1990/student/';

  constructor(private http: Http) { }

  getAllJobs() {
    return this.http.get(`${this._RecruiterURL}getAllJobs`)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  getApplicantInfo(id) {
    return this.http.get(`${this._UserURL}getSessionUser/` + id)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  getAppliedJobs(jobId) {
    return this.http.get(`${this._RecruiterURL}getAppliedJobs/` + jobId)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  storeJob(newJob) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this._RecruiterURL}storeJob`, newJob, { headers: headers })
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  editJob(editedJob) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.put(`${this._RecruiterURL}editJob/` + editedJob._id, editedJob, { headers: headers })
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  deleteJob(jobId) {
    return this.http.delete(`${this._RecruiterURL}deleteJob/` + jobId)
      .pipe(
        map(
          result => result.json()
        )
      )
  };

  deleteAppliedJob(studentId) {
    return this.http.delete(`${this._StudentURL}deleteAppliedJob/` + studentId)
      .pipe(
        map(
          result => result.json()
        )
      )
  };
}
