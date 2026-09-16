import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-group',
  template: `
    <div class="container">
      @for (field of field.fieldGroup; track field) {
        <formly-field
          [class]="field.type === 'formly-designer-textarea' ? 'textarea' : ''"
          [field]="field"
        />
      }
    </div>
  `,
  styles: [
    `
      .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(max(40%, 150px), 1fr));
        align-items: center;
        column-gap: 10px;
      }
      formly-field {
        min-width: 0;
        &:empty {
          display: block;
        }
        &.textarea {
          grid-column: 1 / -1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyField],
})
export class FormlyEditorGroup extends FieldType {}
