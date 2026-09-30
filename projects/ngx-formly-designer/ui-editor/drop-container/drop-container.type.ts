import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-drop-container',
  templateUrl: './drop-container.type.html',
  styleUrl: './drop-container.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyEditorDropContainer extends FieldType<FieldTypeConfig> {}
