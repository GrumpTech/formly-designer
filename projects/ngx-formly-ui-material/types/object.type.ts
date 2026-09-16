import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FieldType,
  FormlyField,
  FormlyValidationMessage,
} from '@ngx-formly/core';

@Component({
  selector: 'formly-mat-object',
  template: `
    <div>
      @if (props.label) {
        <mat-label>{{ props.label }}</mat-label>
      }
      @if (props.description) {
        <mat-hint>{{ props.description }}</mat-hint>
      }
      @if (showError && formControl.errors) {
        <mat-error>
          <formly-validation-message [field]="field" />
        </mat-error>
      }
      @for (f of field.fieldGroup; track f) {
        <formly-field [field]="f" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, FormlyField, FormlyValidationMessage],
})
export class FormlyObject extends FieldType {}
