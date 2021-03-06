import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private _UserURL = 'http://localhost:1990/serve/';
  private _StudentURL = 'http://localhost:1990/student/';
  private _RecruiterURL = 'http://localhost:1990/recruiter/';

  constructor(private http: Http) { }

  getSessionUser(userId) {
    return this.http.get(`${this._UserURL}getSessionUser/` + userId)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  getAllJobs() {
    return this.http.get(`${this._RecruiterURL}getAllJobs`)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  getAppliedJobs(userId) {
    return this.http.get(`${this._StudentURL}getAppliedJobs/` + userId)
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  applyJob(appliedJob) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this._StudentURL}applyJob`, appliedJob, { headers: headers })
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  editAppliedJob(editAppliedJob) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Content-Type', 'application/json');
    return this.http.put(`${this._StudentURL}editAppliedJob/` + editAppliedJob._id, editAppliedJob, { headers: headers })
      .pipe(
        map(
          result => result.json()
        )
      );
  }

  deleteAppliedJob(studentId) {
    return this.http.delete(`${this._StudentURL}deleteAppliedJob/` + studentId)
      .pipe(
        map(
          result => result.json()
        )
      )
  };
}
