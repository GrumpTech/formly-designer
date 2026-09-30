import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FieldType,
  FormlyField,
  FormlyValidationMessage,
} from '@ngx-formly/core';

@Component({
  selector: 'formly-p-object',
  templateUrl: './object.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyField, FormlyValidationMessage],
})
export class FormlyObject extends FieldType {}
