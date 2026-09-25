import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-drop-container',
  template: `
    <div class="drop-container">{{ props.message ?? '&nbsp;' }}</div>
  `,
  styles: `
    .drop-container {
      color: #cccccc;
      background-color: #f8f8f8;
      border: 1px dashed silver;
      border-radius: 5px;
      padding: 5px;
      margin: 5px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyEditorDropContainer extends FieldType<FieldTypeConfig> {}
