import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyField, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-message-container',
  templateUrl: './message-container.type.html',
  styleUrl: './message-container.type.scss',
  imports: [FormlyField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyMessageContainer extends FieldType<FormlyFieldConfig> {}
