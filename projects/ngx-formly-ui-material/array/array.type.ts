import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {
  FieldArrayType,
  FieldTypeConfig,
  FormlyField,
  FormlyFieldProps,
  FormlyValidationMessage,
} from '@ngx-formly/core';

interface ArrayProps extends FormlyFieldProps {
  emptyArrayMessage?: string;
  addButtonLabel?: string;
}

@Component({
  selector: 'formly-mat-array',
  templateUrl: './array.type.html',
  styleUrl: './array.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormFieldModule,
    FormlyField,
    FormlyValidationMessage,
  ],
})
export class FormlyArray extends FieldArrayType<FieldTypeConfig<ArrayProps>> {}
