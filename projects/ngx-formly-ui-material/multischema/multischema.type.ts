import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FieldType,
  FormlyField,
  FormlyValidationMessage,
} from '@ngx-formly/core';

@Component({
  selector: 'formly-mat-multi-schema',
  templateUrl: './multischema.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, FormlyField, FormlyValidationMessage],
})
export class FormlyMultiSchema extends FieldType {}
