import { LOGIN_TEXT } from '../../config/login-text.config';
import { LOGIN_ERRORS, DEMO_AUTH } from '../../../../core/config/auth.config';
import { ROUTE_URLS } from '../../../../core/config/navigation.config';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly text = LOGIN_TEXT;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly demoAuth = DEMO_AUTH;
  readonly error = signal('');
  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  submit(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(LOGIN_ERRORS.required);
      return;
    }
    const { username, password } = this.form.getRawValue();
    if (!this.auth.login(username, password)) {
      this.error.set(LOGIN_ERRORS.invalid);
      return;
    }
    void this.router.navigateByUrl(ROUTE_URLS.stations);
  }
}
