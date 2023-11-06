import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  private subject = new Subject();
  constructor() { }

  sendMoreActionsEvent(event: any) {
    this.subject.next(event);
  }

  handleMoreActionsEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
