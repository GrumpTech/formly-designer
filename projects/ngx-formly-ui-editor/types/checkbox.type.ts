import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FieldType,
  FieldTypeConfig,
  FormlyAttributes,
  FormlyFieldProps,
} from '@ngx-formly/core';
import { FormFieldControl } from '../components/form-field-control.component';

@Component({
  selector: 'formly-editor-checkbox',
  template: `
    <mat-form-field>
      <formly-form-field-control (containerClick)="handleContainerClick()">
        <mat-checkbox [formControl]="formControl" [formlyAttributes]="field">
          {{ props.label }}
        </mat-checkbox>
      </formly-form-field-control>
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        height: 78px;
      }
      mat-checkbox {
        margin-top: -8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckbox,
    FormlyAttributes,
    FormFieldControl,
  ],
})
export class FormlyEditorCheckbox extends FieldType<
  FieldTypeConfig<FormlyFieldProps>
> {
  readonly checkbox = viewChild.required(MatCheckbox);

  handleContainerClick() {
    this.checkbox().focus();
  }
}
