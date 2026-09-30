import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-group',
  templateUrl: './group.type.html',
  styleUrl: './group.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyField],
})
export class FormlyEditorGroup extends FieldType {}
