import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FieldType,
  FormlyField,
  FormlyValidationMessage,
} from '@ngx-formly/core';

@Component({
  selector: 'formly-mat-object',
  templateUrl: './object.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, FormlyField, FormlyValidationMessage],
})
export class FormlyObject extends FieldType {}
