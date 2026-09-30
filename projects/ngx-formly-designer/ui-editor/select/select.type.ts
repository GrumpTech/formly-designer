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
  templateUrl: './select.type.html',
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
