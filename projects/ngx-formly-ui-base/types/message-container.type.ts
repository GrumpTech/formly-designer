import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyField, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-message-container',
  template: `
    @for (field of field.fieldGroup; track field) {
      <formly-field [field]="field" />
    }
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 0 20px 0 20px;
      }
    `,
  ],
  imports: [FormlyField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyMessageContainer extends FieldType<FormlyFieldConfig> {}
