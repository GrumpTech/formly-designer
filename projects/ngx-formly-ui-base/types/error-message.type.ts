import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { ErrorMessageProps } from '../models';

@Component({
  selector: 'formly-error',
  template: `
    <h2>{{ props.title ?? '' }}</h2>
    <p>{{ props.message ?? '' }}</p>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyErrorMessage
  extends FieldType<FormlyFieldConfig<ErrorMessageProps>>
  implements OnInit
{
  ngOnInit(): void {
    this.props.error && console.error(this.props.error);
  }
}
