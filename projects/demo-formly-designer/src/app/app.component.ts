import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { getApiPath, getSwaggerPath } from './methods/methods';
import { SettingsDialog } from './dialogs/settings/settings.dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    MatButton,
    MatIconButton,
    MatIcon,
    MatTooltip,
  ],
})
export class App {
  protected urlPrefix = '';
  protected materialLink: any[] = [];
  protected primeNgLink: any = [];
  protected showSettings = environment.useSettings;
  protected showSettingsWarning: boolean;
  protected showDialog = false;

  private dialog = inject(MatDialog);

  constructor() {
    const router = inject(Router);
    router.events
      .pipe(takeUntilDestroyed())
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects;
        const segments =
          router.parseUrl(url).root.children[PRIMARY_OUTLET].segments;
        const link = segments.flatMap((s) =>
          Object.keys(s.parameters).length ? [s.path, s.parameters] : [s.path],
        );
        this.materialLink = ['/material', ...link.slice(1)];
        this.primeNgLink = ['/prime-ng', ...link.slice(1)];
        if (url.startsWith('/material')) {
          this.urlPrefix = '/material';
        } else if (url.startsWith('/prime-ng')) {
          this.urlPrefix = '/prime-ng';
        } else {
          this.urlPrefix = '';
        }
        if (url.startsWith(`${this.urlPrefix}/open-api-client`)) {
          if (getApiPath() === '' || getSwaggerPath() === '') {
            this.showSettingsDialog();
          }
        } else if (
          url.startsWith(`${this.urlPrefix}/app`) &&
          getApiPath() === ''
        ) {
          this.showSettingsDialog();
        }
      });
    this.showSettingsWarning =
      this.showSettings && (getApiPath() === '' || getSwaggerPath() === '');
  }

  protected showSettingsDialog(): void {
    this.dialog.open(SettingsDialog, {
      width: '500px',
    });
  }
}
