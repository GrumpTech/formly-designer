import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-textarea',
  templateUrl: './textarea.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    FormlyAttributes,
  ],
})
export class FormlyEditorTextarea extends FieldType<FieldTypeConfig> {}
