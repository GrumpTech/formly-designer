import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { ErrorMessageProps } from './models';

@Component({
  selector: 'formly-error-message',
  templateUrl: './error-message.type.html',
  styleUrl: './error-message.type.scss',
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
