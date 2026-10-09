import { SESSION_TEXT } from '../../../../core/config/session-text.config';
import { DEMO_AUTH } from '../../../../core/config/auth.config';
import { ROUTE_URLS } from '../../../../core/config/navigation.config';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { StationsStore } from '../../data/stations.store';

@Component({
  selector: 'app-stations-shell',
  imports: [RouterOutlet, RouterLink],
  providers: [StationsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stations-shell.html',
  styleUrl: './stations-shell.scss',
})
export class StationsShell {
  readonly routes = ROUTE_URLS;
  readonly username = DEMO_AUTH.username;
  readonly text = SESSION_TEXT;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl(ROUTE_URLS.login);
  }
}
