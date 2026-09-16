import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FORMLY_APP_CONFIG } from '@grumptech/ngx-formly-ui-base';
import { ButtonDirective } from 'primeng/button';

interface LinkProps extends FormlyFieldProps {
  url?: string;
}
@Component({
  selector: 'formly-p-link',
  template: `
    @if (props.label) {
      <label [for]="id">{{ props.label }}</label>
    }
    <div>
      <a
        pButton
        [id]="id"
        [routerLink]="getUrl()"
        [relativeTo]="route.parent"
        class="p-button-link link-button"
      >
        {{ formControl.value ?? 'select' }}
      </a>
    </div>
  `,
  styles: [
    `
      .link-button {
        display: inline-block;
        width: auto;
        &:not(:hover) {
          text-decoration: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, RouterLink],
})
export class FormlyLink extends FieldType<FieldTypeConfig<LinkProps>> {
  protected route = inject(ActivatedRoute);

  private appConfig = inject(FORMLY_APP_CONFIG);

  getUrl(): string {
    const url = this.props?.url;
    return url &&
      (typeof this.formControl.value === 'string' ||
        typeof this.formControl.value === 'number')
      ? `${this.appConfig.frontendBaseUrl ?? ''}${url}`.replace(
          `{${this.key}}`,
          `${this.formControl.value}`,
        )
      : '';
  }
}
