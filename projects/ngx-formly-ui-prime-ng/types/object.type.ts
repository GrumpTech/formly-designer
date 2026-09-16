import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FieldType,
  FormlyField,
  FormlyValidationMessage,
} from '@ngx-formly/core';

@Component({
  selector: 'formly-p-object',
  template: `
    <div>
      @if (props.label) {
        <label>{{ props.label }}</label>
      }
      <div>
        @if (showError && formControl.errors) {
          <small class="p-error">
            <formly-validation-message [field]="field" />
          </small>
        }
      </div>
      @for (f of field.fieldGroup; track f) {
        <formly-field [field]="f" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyField, FormlyValidationMessage],
})
export class FormlyObject extends FieldType {}
