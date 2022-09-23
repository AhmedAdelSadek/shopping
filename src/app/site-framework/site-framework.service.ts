import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
// Config Service
export class SiteFrameworkService {


  private _configSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  
  set config(value) {
    // Get the value from the behavior subject
    let config = this._configSubject.getValue();

    // Merge the new config
    config = _.merge({}, config, value);

    // Notify the observers
    this._configSubject.next(config);
  }

  get config(): any | Observable<any> {
    return this._configSubject.asObservable();
  }


  constructor () {  }
}
