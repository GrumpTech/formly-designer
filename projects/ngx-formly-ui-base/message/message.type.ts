import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { MessageProps } from './models';

@Component({
  selector: 'formly-message',
  templateUrl: './message.type.html',
  styleUrl: './message.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyMessage extends FieldType<FormlyFieldConfig<MessageProps>> {}
