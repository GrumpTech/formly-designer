import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Navigation } from '@grumptech/ngx-basic-ui/navigation';
import { FORMLY_APP_CONFIG } from '../config';
import { AppService } from '../services/app-service';

@Component({
  selector: 'formly-navigation',
  template: `
    <b-navigation
      [urlPrefix]="appConfig.frontendBaseUrl ?? ''"
      [menu]="menu()"
    />
  `,
  styles: [
    `
      @use '@grumptech/ngx-basic-ui/thin-scrollbars';

      b-navigation {
        display: block;
        width: 300px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.2);
        @include thin-scrollbars.scrollbars;
      }
    `,
  ],
  imports: [Navigation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAppNavigation extends FieldType<FormlyFieldConfig> {
  protected menu = inject(AppService, { optional: true })?.menu ?? signal([]);
  protected appConfig = inject(FORMLY_APP_CONFIG);
}
