import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-warning',
  template: `
    <div class="message">
      <mat-icon color="warn" iconPositionEnd>warning</mat-icon> &nbsp;
      {{ props.message }}
    </div>
  `,
  styles: `
    .message {
      display: flex;
      align-items: center;
      padding: 5px;
      margin: 5px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class FormlyEditorWarning extends FieldType<FieldTypeConfig> {}
