import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation, MenuItem } from '@grumptech/ngx-basic-ui/navigation';
import { BreadcrumbPart, Breadcrumb } from '@grumptech/ngx-basic-ui/breadcrumb';
import { AppService } from '@grumptech/ngx-formly-ui-base';
import formlyApp from '../../forms/formly-app.json';

@Component({
  selector: 'custom-app',
  templateUrl: './custom-app.component.html',
  styleUrl: './custom-app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Navigation, Breadcrumb],
  providers: [AppService],
})
export class CustomApp {
  menu: MenuItem[];
  breadcrumbParts: Signal<BreadcrumbPart[]>;

  constructor() {
    const appService = inject(AppService);
    appService.initialize(formlyApp[0]);
    this.menu = appService.menu();
    this.breadcrumbParts = appService.breadcrumbParts;
  }
}
