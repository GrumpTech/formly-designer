import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';

@Component({
  selector: 'formly-editor-input',
  template: `
    <mat-form-field floatLabel="always">
      <mat-label>{{ props.label }}</mat-label>
      <input
        matInput
        [type]="props.type || 'input'"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <mat-hint>{{ props.description }}</mat-hint>
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
export class FormlyEditorInput extends FieldType<FieldTypeConfig> {}
