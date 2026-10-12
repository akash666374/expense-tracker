import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const modifiedRequest = req.clone({
    setHeaders: {
      'X-App-Name': 'ExpenseTracker'
    }
  });

  console.log('HTTP Request:', req.url);

  return next(modifiedRequest);

};