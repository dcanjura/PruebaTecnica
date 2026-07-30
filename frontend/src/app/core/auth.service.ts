import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api.config';

export interface AuthResponse {
  token: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'product-manager-session';
  private readonly session = signal<AuthResponse | null>(this.readSession());

  readonly user = computed(() => this.session());
  readonly isAuthenticated = computed(() => Boolean(this.session()?.token));

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap(response => this.saveSession(response)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.session.set(null);
  }

  token(): string | null {
    return this.session()?.token ?? null;
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.storageKey, JSON.stringify(response));
    this.session.set(response);
  }

  private readSession(): AuthResponse | null {
    try {
      const value = localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as AuthResponse : null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
