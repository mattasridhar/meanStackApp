import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

declare var annyang: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  //creating observables
  userPhrases$ = new Subject<{ [key: string]: string }>();
  errors$ = new Subject<{ [key: string]: any }>();
  isListening = true;
  isCapturingConcerns = false;
  hasSpeechRecognizer = false;
  // concernSpoken: String = "InYuGo's Listening....Speak 'Hey Listen' to record your concerns...";

  nonMatchedConcernString: String;

  constructor(
    private zone: NgZone,
  ) { }

  get speechSupported(): boolean {
    return !!annyang;
  }

  init() {
    if (annyang !== null) {
      let that = this;
      //creating the commands that we will use to identify if the user is Speaking to us or not
      let commands = {
        'hey listen': function () {
          console.log("InYuGo is now listening to you voice");
          that.zone.run(() => {
            that.isListening = true;
            that.isCapturingConcerns = true;
            // that.concernSpoken = "InYuGo's Listening to your concerns...";
            // console.log("concernSpoke: " + that.concernSpoken);
            // that.infoTextString = 'InYuGo is now listening to you queries. Use keyboard if you want to tweak your spoken concern.';
          });

          const newCommands = {
            'clear :clear': (clear) => {
              that.zone.run(() => {
                that.userPhrases$.next({ type: 'clear', 'word': clear });
              });
            },
            'stop :stop': (stop) => {
              that.zone.run(() => {
                that.userPhrases$.next({ type: 'stop', 'word': stop });
              });
            },
            'search :search': (search) => {
              that.zone.run(() => {
                that.userPhrases$.next({ type: 'search', 'word': search });
              });
            },
            'show :show': (show) => {
              that.zone.run(() => {
                that.userPhrases$.next({ type: 'show', 'word': show });
              });
            },
            '*how': function (how) {
              that.zone.run(() => {
                that.userPhrases$.next({ type: '*how', 'word': how });
              });
            },
          };
          that._initiateSpeechRecognizer(annyang, newCommands);
        },
        'stop :stop': (stop) => {
          that.zone.run(() => {
            that.userPhrases$.next({ type: 'stop', 'word': stop });
          });
        },
      };

      this._initiateSpeechRecognizer(annyang, commands);
      this._initializeErrorCallback(annyang);
    }
  }

  _initiateSpeechRecognizer(annyang, commands) {
    this.hasSpeechRecognizer = true;
    annyang.addCommands(commands);

    /* annyang.trigger('Time for me'), function () {
      console.log("I said Time for Me");
    }; */

    //logging everything the user is uttering
    annyang.addCallback('result', (userSaid) => {
      console.log("User said: " + userSaid);
      console.log("------------");
    });

    annyang.addCallback('resultNoMatch', function (userSaid, commandText, phrases) {
      this.nonMatchedConcernString = userSaid;
      console.log("User said not Matched: " + this.nonMatchedConcernString);
      console.log("------------");

    });

    annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
      console.log("User said Matched: " + userSaid);
      console.log("------------");
    });
  }

  _initializeErrorCallback(annyang) {
    annyang.addCallback('errorNetwork', (error) => {
      console.log("Network Error: " + error);
    });

    annyang.addCallback('errorPermissionBlocked', (err) => {
      this._errorHandler('blocked', 'Browser blocked microphone permissions.', err);
    });

    annyang.addCallback('errorPermissionDenied', (err) => {
      this._errorHandler('denied', 'User denied microphone permissions.', err);
    });
  }

  private _errorHandler(error, msg, errObj) {
    this.zone.run(() => {
      this.errors$.next({
        error: error,
        message: msg,
        obj: errObj
      });
    });
  }

  startListening() {
    annyang.start();
    this.isListening = true;
  }

  stopListening() {
    annyang.abort();
    // this.infoTextString = 'Please type your concerns below.';
    this.isListening = false;
    this.isCapturingConcerns = false;
  }

}