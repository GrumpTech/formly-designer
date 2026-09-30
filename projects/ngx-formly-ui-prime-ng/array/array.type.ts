import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FieldArrayType,
  FieldTypeConfig,
  FormlyField,
  FormlyFieldProps,
  FormlyValidationMessage,
} from '@ngx-formly/core';
import { ButtonDirective } from 'primeng/button';

interface ArrayProps extends FormlyFieldProps {
  emptyArrayMessage?: string;
  addButtonLabel?: string;
}
@Component({
  selector: 'formly-p-array',
  templateUrl: './array.type.html',
  styleUrl: './array.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, FormlyField, FormlyValidationMessage],
})
export class FormlyArray extends FieldArrayType<FieldTypeConfig<ArrayProps>> {}
