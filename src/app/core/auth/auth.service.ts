import { DEMO_AUTH } from '../config/auth.config';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal(this.readSession());
  readonly authenticated = this.session.asReadonly();

  login(username: string, password: string): boolean {
    if (username !== DEMO_AUTH.username || password !== DEMO_AUTH.password) return false;
    this.session.set(true);
    try {
      sessionStorage.setItem(DEMO_AUTH.sessionKey, DEMO_AUTH.sessionValue);
    } catch {
      /* Storage may be disabled. */
    }
    return true;
  }

  logout(): void {
    this.session.set(false);
    try {
      sessionStorage.removeItem(DEMO_AUTH.sessionKey);
    } catch {
      /* In-memory session still cleared. */
    }
  }

  private readSession(): boolean {
    try {
      return sessionStorage.getItem(DEMO_AUTH.sessionKey) === DEMO_AUTH.sessionValue;
    } catch {
      return false;
    }
  }
}
