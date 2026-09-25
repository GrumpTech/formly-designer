import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Navigation } from '@grumptech/ngx-basic-ui/navigation';
import { Breadcrumb } from '@grumptech/ngx-basic-ui/breadcrumb';
import { AppProps } from '../models';
import { AppService } from '../services/app-service';
import { FORMLY_APP_CONFIG } from '../config';

@Component({
  selector: 'formly-app',
  template: `
    <b-navigation
      [urlPrefix]="appConfig.frontendBaseUrl ?? ''"
      [menu]="appService.menu()"
    />
    <div class="container">
      @if (appService.breadcrumbParts().length) {
        <b-breadcrumb
          [urlPrefix]="appConfig.frontendBaseUrl ?? ''"
          [parts]="appService.breadcrumbParts()"
        />
      } @else {
        <div class="spacing"></div>
      }
      <div class="page-container">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      @use '@grumptech/ngx-basic-ui/thin-scrollbars';

      :host {
        display: flex;
        height: 100%;
      }
      .container {
        display: flex;
        flex-direction: column;
        flex: 1;

        @include thin-scrollbars.scrollbars;
      }
      b-navigation {
        display: block;
        width: 300px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.2);
        @include thin-scrollbars.scrollbars;
      }
      .page-container {
        min-height: 0;
        flex: 1;
      }
      b-breadcrumb {
        margin: 20px;
      }
      .spacing {
        height: 20px;
      }
    `,
  ],
  imports: [RouterOutlet, Navigation, Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppService],
})
export class FormlyApp
  extends FieldType<FormlyFieldConfig<AppProps>>
  implements OnInit
{
  protected appService = inject(AppService);
  protected appConfig = inject(FORMLY_APP_CONFIG);

  ngOnInit(): void {
    this.appService.initialize(this.field);
  }
}
