import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-null',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyNull extends FieldType {}
