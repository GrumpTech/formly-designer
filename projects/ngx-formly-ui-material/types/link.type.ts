import {
  Component,
  ChangeDetectionStrategy,
  viewChild,
  inject,
} from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { FormlyFieldProps } from '@ngx-formly/material/form-field';
import { FORMLY_APP_CONFIG } from '@grumptech/ngx-formly-ui-base';

interface LinkProps extends FormlyFieldProps {
  url?: string;
}
@Component({
  selector: 'formly-mat-link',
  template: `
    <a
      mat-button
      [id]="id"
      [routerLink]="getUrl()"
      [relativeTo]="route.parent"
      color="primary"
    >
      {{ value ?? 'select' }}
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, RouterLink],
})
export class FormlyLink extends FieldType<FieldTypeConfig<LinkProps>> {
  protected route = inject(ActivatedRoute);
  private appConfig = inject(FORMLY_APP_CONFIG);

  private readonly link = viewChild.required(MatAnchor);

  override defaultOptions = {
    props: {
      floatLabel: 'always' as const,
    },
  };

  override onContainerClick(event: MouseEvent): void {
    this.link().focus();
    super.onContainerClick(event);
  }

  override get disabled(): boolean {
    return false;
  }

  getUrl(): string {
    const url = this.props?.url;
    return url &&
      (typeof this.value === 'string' || typeof this.value === 'number')
      ? `${this.appConfig.frontendBaseUrl ?? ''}${url}`.replace(
          `{${this.key}}`,
          this.value.toString(),
        )
      : '';
  }
}
