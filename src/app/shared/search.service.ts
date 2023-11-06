import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private subject = new Subject<any>();
  constructor() {

  }

  sendSearchEvent(event: any) {
    this.subject.next(event);
  }

  handleSearchEvent(): Observable<any> {
    return this.subject.asObservable();
  }

}
