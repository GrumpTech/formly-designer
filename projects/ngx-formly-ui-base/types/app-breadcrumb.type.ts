import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Breadcrumb } from '@grumptech/ngx-basic-ui/breadcrumb';
import { FORMLY_APP_CONFIG } from '../config';
import { AppService } from '../services/app-service';

@Component({
  selector: 'formly-breadcrumb',
  template: `
    <b-breadcrumb
      [urlPrefix]="appConfig.frontendBaseUrl ?? ''"
      [parts]="breadcrumbParts()"
    />
  `,
  styles: [
    `
      b-breadcrumb {
        margin: 20px;
      }
    `,
  ],
  imports: [Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAppBreadcrumb extends FieldType<FormlyFieldConfig> {
  protected breadcrumbParts =
    inject(AppService, { optional: true })?.breadcrumbParts ?? signal([]);
  protected appConfig = inject(FORMLY_APP_CONFIG);
}
