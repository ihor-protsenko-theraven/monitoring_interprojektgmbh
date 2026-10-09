import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';
import { AuthService } from '../../../../core/auth/auth.service';

describe('Login form', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ imports: [Login], providers: [provideRouter([])] });
  });
  it('shows validation and rejects a wrong password', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.error()).toBe('Введіть логін і пароль.');
    fixture.componentInstance.form.setValue({ username: 'admin', password: 'wrong' });
    fixture.componentInstance.submit();
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector<HTMLElement>('[role="alert"]')?.textContent).toContain(
      'Неправильний',
    );
    expect(TestBed.inject(AuthService).authenticated()).toBe(false);
  });
  it('submits the form and navigates to stations after successful login', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    for (const [id, value] of [
      ['username', 'admin'],
      ['password', 'admin'],
    ]) {
      const input = root.querySelector<HTMLInputElement>('#' + id)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(TestBed.inject(AuthService).authenticated()).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/stations');
  });
});
