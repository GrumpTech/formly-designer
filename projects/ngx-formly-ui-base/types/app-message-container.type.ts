import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyField, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-message-container',
  template: `
    @for (field of field.fieldGroup; track field) {
      <formly-field [field]="field" />
    }
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 20px;
      }
    `,
  ],
  imports: [FormlyField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAppMessageContainer extends FieldType<FormlyFieldConfig> {}
