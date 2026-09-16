import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-textarea',
  template: `
    <mat-form-field floatLabel="always">
      <mat-label>{{ props.label }}</mat-label>
      <textarea
        matInput
        rows="5"
        [formControl]="formControl"
        [formlyAttributes]="field"
      ></textarea>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    FormlyAttributes,
  ],
})
export class FormlyEditorTextarea extends FieldType<FieldTypeConfig> {}
