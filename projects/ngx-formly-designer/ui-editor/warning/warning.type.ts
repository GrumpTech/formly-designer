import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-warning',
  templateUrl: './warning.type.html',
  styleUrl: './warning.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class FormlyEditorWarning extends FieldType<FieldTypeConfig> {}
