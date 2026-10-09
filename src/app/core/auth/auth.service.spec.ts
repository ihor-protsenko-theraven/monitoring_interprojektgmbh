import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('Demo authentication', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });
  it('rejects incorrect credentials without creating a session', () => {
    const auth = TestBed.inject(AuthService);
    expect(auth.login('admin', 'wrong')).toBe(false);
    expect(auth.authenticated()).toBe(false);
    expect(sessionStorage.length).toBe(0);
  });
  it('accepts admin/admin, restores the session and clears it on logout', () => {
    const auth = TestBed.inject(AuthService);
    expect(auth.login('admin', 'admin')).toBe(true);
    TestBed.resetTestingModule();
    const restored = TestBed.inject(AuthService);
    expect(restored.authenticated()).toBe(true);
    restored.logout();
    expect(restored.authenticated()).toBe(false);
    expect(sessionStorage.getItem('monitoring.demo-session')).toBeNull();
  });
  it('works in memory when browser storage is unavailable', () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const auth = TestBed.inject(AuthService);
    expect(auth.login('admin', 'admin')).toBe(true);
    auth.logout();
    expect(auth.authenticated()).toBe(false);
    get.mockRestore();
    set.mockRestore();
    remove.mockRestore();
  });
});
