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
import { FormFieldControl } from '../form-field-control/form-field-control.component';

@Component({
  selector: 'formly-editor-checkbox',
  templateUrl: './checkbox.type.html',
  styleUrl: './checkbox.type.scss',
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
