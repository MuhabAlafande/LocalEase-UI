import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loaderService = inject(LoaderService);
  loaderService.show();

  return next(req).pipe(
    catchError(error => {
      loaderService.hide();
      throw error;
    }),
    finalize(() => {
      loaderService.hide();
    })
  );
};
