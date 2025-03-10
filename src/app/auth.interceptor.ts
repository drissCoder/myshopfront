import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { inject } from '@angular/core';
import { AuthService } from "./auth.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Inject the AuthService to get the stored JWT token
  private authService = inject(AuthService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from the AuthService
    const token = localStorage.getItem('jwt');
    console.log("driss el " + token);
    // If a token exists, add it to the Authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}