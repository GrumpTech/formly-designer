import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { ErrorMessageProps } from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'demo-error-message',
  templateUrl: './custom-error-message.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomErrorMessage extends FieldType<
  FormlyFieldConfig<ErrorMessageProps>
> {}
