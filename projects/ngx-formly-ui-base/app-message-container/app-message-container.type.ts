import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyField, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-message-container',
  templateUrl: './app-message-container.type.html',
  styleUrl: './app-message-container.type.scss',
  imports: [FormlyField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAppMessageContainer extends FieldType<FormlyFieldConfig> {}
