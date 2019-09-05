import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactUsService } from './contact-us.service';

import { appConcernSchema } from '../../schema/appConcernSchema'

import { SpeechService } from '../speech.service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
  providers: [ContactUsService]
})
export class ContactUsComponent implements OnInit, OnDestroy {

  clearQuery: String;
  stopQuery: String;
  searchQuery: String;
  showQuery: String;
  concernQuery: String;

  clearSub: Subscription;
  stopSub: Subscription;
  searchSub: Subscription;
  showSub: Subscription;
  concernSub: Subscription;

  errorSub: Subscription;
  errorMsg: String = " Browser doesn't support Speech Recognition.";
  hasError: boolean = false;
  hasResultError: boolean = false;
  errorResultMsg: String = "This concern has not been answered yet. Please call us for assistance and the concern will be added. Our Helpline is +1(902)-989-0369";

  concernSpoken: String = "";//"InYuGo's Listening....Speak 'Hey Listen' to record your concerns..."
  concernRaised: String = "";
  resultFetched: String = "";

  hasConcern: boolean = false;
  hasResults: boolean = false;

  appConcerns: appConcernSchema[] = [];

  constructor(
    public speechService: SpeechService,
    private contactUsService: ContactUsService
  ) { }

  ngOnInit() {
    this.speechService.init();
    if (this.speechService.speechSupported) {
      this.speechService.startListening();
      this._listenForClear();
      this._listenForStop();
      this._listenForSearch();
      this._listenForShow();
      this._listenForConcern();
    }
    this._listenErrors();

  }

  get infoText(): String {
    return (this.speechService.isListening && this.speechService.isCapturingConcerns) ?
      'InYuGo is now listening to you queries. ' +
      'Use keyboard if you want to tweak your spoken concern.' :
      'Please type your concerns below.';
  }

  _listenForClear() {
    this.clearSub = this.speechService.userPhrases$.pipe(
      filter(obj => obj.type === 'clear'),
      map(clearObj => clearObj.word)
    ).subscribe(
      clearString => {
        this._setError();
        if (clearString.includes("field") || clearString.includes("search") || clearString.includes("query")) {
          this.concernSpoken = "";
          this.resultFetched = "";
          this.hasResults = false;
        }
      }
    );
  }

  _listenForStop() {
    this.stopSub = this.speechService.userPhrases$.pipe(
      filter(obj => obj.type === 'stop'),
      map(stopObj => stopObj.word)
    ).subscribe(
      stopString => {
        this._setError();
        if (stopString.includes("listen")) {
          this.speechService.stopListening();
        }
      }
    );
  }

  _listenForSearch() {
    this.searchSub = this.speechService.userPhrases$.pipe(
      filter(obj => obj.type === 'search'),
      map(searchObj => searchObj.word)
    ).subscribe(
      searchString => {
        this._setError();
        this.concernSpoken = "Search " + searchString;
        this._fetchResultsForSearchConcerns(this.concernSpoken);
      }
    );
  }

  _listenForShow() {
    this.showSub = this.speechService.userPhrases$.pipe(
      filter(obj => obj.type === 'show'),
      map(showObj => showObj.word)
    ).subscribe(
      showString => {
        this._setError();
        this.concernSpoken = "Show " + showString;
        this._fetchResultsForShowConcerns(this.concernSpoken);
      }
    );
  }

  _listenForConcern() {
    this.concernSub = this.speechService.userPhrases$.pipe(
      filter(obj => obj.type === '*how'),
      map(concernObj => concernObj)
    ).subscribe(
      concernString => {
        this._setError();
        this.concernSpoken = concernString.word;
        if (this.concernSpoken.includes("stop listen")) {
          this.speechService.stopListening();
        } else {
          this._fetchResultsForRemainingConcerns(this.concernSpoken);
        }
      }
    );
  }

  _listenErrors() {
    this.errorSub = this.speechService.errors$
      .subscribe(err => this._setError(err));
  }

  _setError(err?: any) {
    if (err) {
      this.errorMsg = err.message;
      this.hasError = true;
    } else {
      this.errorMsg = null;
      this.hasError = false;
    }
  }

  //Ex: Search Ammu, Search Cookie, Search Maplesoft
  _fetchResultsForSearchConcerns(searchConcern) {
    this._resetResultFields();
    this.contactUsService.getSearchResponse(searchConcern)
      .subscribe(response => {
        if (response !== null && response.answer !== null) {
          this.concernRaised = this.concernSpoken;
          this.hasResults = true;
          this.resultFetched = response.answer;
          this.hasResultError = false;
        } else {
          this.hasResultError = true;
        }

      });
  }

  //Ex: Show Jobs, Show Companies
  _fetchResultsForShowConcerns(showConcern) {
    this._resetResultFields();
    this.contactUsService.getSearchResponse(showConcern)
      .subscribe(response => {
        if (response !== null && response.answer !== null) {
          this.concernRaised = this.concernSpoken;
          this.hasResults = true;
          this.resultFetched = response.answer;
          this.hasResultError = false;
        } else {
          this.hasResultError = true;
        }

      });

  }

  //Ex: Show all users, How to find Apply
  _fetchResultsForRemainingConcerns(otherConcern) {
    this._resetResultFields();
    this.contactUsService.getAllConcerns()
      .subscribe(response => {
        this.appConcerns = response;
        this.appConcerns.forEach(eachConcern => {
          this.resultFetched = this.resultFetched.concat(eachConcern.question.concat('\n\t'.concat(eachConcern.answer.concat('\n'))));
        });
        if (this.resultFetched.length > 0) {
          this.concernRaised = this.concernSpoken;
          this.hasResults = true;
        } else {
          this.hasResultError = true;
        }
      });

  }

  _resetResultFields() {
    this.resultFetched = "";
    this.hasResults = false;
    this.hasResultError = false;
  }

  ngOnDestroy(): void {
    this.speechService.stopListening();
    this.searchSub.unsubscribe();
    this.showSub.unsubscribe();
    this.errorSub.unsubscribe();
  }

}
