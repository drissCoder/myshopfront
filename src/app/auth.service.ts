import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8009/auth/token'; // Replace with your API endpoint
  // Signals to track login state and username
  isLoggedInSignal = signal<boolean>(this.isLoggedIn());
  loggedInUsernameSignal = signal<string | null>(this.getLoggedInUsername());
  private jwtToken = signal<string | null>(localStorage.getItem('jwt'));

  constructor(private http: HttpClient) {}

  // POST: Login with email and password
  public login(email: string, password: string): Observable<boolean | { token: string; }> {
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ token: string }>(this.apiUrl, body, { headers }).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('jwt', response.token); // Store JWT token in localStorage
          this.isLoggedInSignal.set(true); // Update login state
          this.loggedInUsernameSignal.set(email); // Update username
          this.jwtToken.set(response.token);
          return true;
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(false); // Return false if login fails
      }),
      tap(() => console.log('Login successful')) // Optional: Add debug logging
    );
  }

  // Logout: Clear JWT from localStorage
  public logout(): void {
    localStorage.removeItem('jwt');
    this.isLoggedInSignal.set(false); // Update login state
    this.loggedInUsernameSignal.set(null); // Clear username
    this.jwtToken.set(null);
  }

  // Check if the user is logged in by verifying the existence of a token
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  public getLoggedInUsername(): string | null {
    const token = localStorage.getItem('jwt');
    if (token) {
      // Decode the JWT to get the username
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload.sub)
      return payload.sub || null; // Ensure the token contains a 'username' claim
    }
    return null;
  }



  // Signal to track the user's roles
  private userRole = computed(() => {
    const token = this.jwtToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("drissee", payload.role);
        return payload.role || null; // Return the role from the token
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    }
    return null;
  });

  // Signal to check if the user has the ADMIN role
  hasRoleAdmin = computed(() => this.userRole() === 'ADMIN');

  // Method to update the JWT token (e.g., after login)
  setToken(token: string | null): void {
    this.jwtToken.set(token);
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
    }
  }    
}