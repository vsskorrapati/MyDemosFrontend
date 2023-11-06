import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  _notification: BehaviorSubject<any> = new BehaviorSubject(null);

  _clear: BehaviorSubject<any> = new BehaviorSubject(null);

  _delete: Subject<any> = new Subject();

  constructor() {}

  setNotification(data: any) {
    if (data) { this._notification.next(data); }
  }

  clearNotification(data: any) {
    if (data) { this._clear.next(data);}
  }

  setOrgDeletionWarning(data: any) {
    if (data) { this._delete.next(data);}
  }
}