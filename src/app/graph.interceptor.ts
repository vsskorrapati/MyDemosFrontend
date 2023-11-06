import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { SharedDataService } from './shared/shared-data.service';

@Injectable()
export class GraphInterceptor implements HttpInterceptor {

  constructor(private dataService: SharedDataService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request);
  }
}
