import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  FieldType,
  FieldTypeConfig,
  FormlyAttributes,
  FormlyFieldProps,
} from '@ngx-formly/core';

interface SelectProps extends FormlyFieldProps {
  multiple?: boolean;
}

@Component({
  selector: 'formly-designer-field-select',
  template: `
    <mat-form-field floatLabel="always">
      <mat-label>{{ props.label }}</mat-label>
      <mat-select
        [formControl]="formControl"
        [formlyAttributes]="field"
        [multiple]="props.multiple"
      >
        @for (option of selectOptions; track option) {
          <mat-option [value]="option.value">
            {{ option.label }}
          </mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelect,
    MatLabel,
    MatOption,
    FormlyAttributes,
  ],
})
export class FormlyEditorSelect
  extends FieldType<FieldTypeConfig<SelectProps>>
  implements OnInit
{
  selectOptions: { value: string; label: string }[] = [];

  ngOnInit() {
    this.selectOptions =
      this.field.props.options instanceof Array ? this.field.props.options : [];
    this.selectOptions.length > 1
      ? this.formControl.enable({ onlySelf: true, emitEvent: false })
      : this.formControl.disable({ onlySelf: true, emitEvent: false });
  }
}
