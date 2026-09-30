import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FieldType,
  FormlyField,
  FormlyValidationMessage,
} from '@ngx-formly/core';

@Component({
  selector: 'formly-p-multi-schema',
  templateUrl: './multischema.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyField, FormlyValidationMessage],
})
export class FormlyMultiSchema extends FieldType {}
