import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MatxFullWidthFormFields } from '@grumptech/ngx-matx/full-width-form-fields';

@Component({
  selector: 'formly-editor-form-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <matx-full-width-form-fields>
        <formly-form
          [fields]="data.fields"
          [form]="form"
          [(model)]="data.model"
        />
      </matx-full-width-form-fields>
    </div>
    <div mat-dialog-actions>
      <button
        mat-stroked-button
        color="primary"
        [mat-dialog-close]="data.model"
      >
        Ok
      </button>
      <button mat-stroked-button (click)="cancel()">Cancel</button>
    </div>
  `,
  styles: [
    `
      [mat-dialog-actions] {
        justify-content: flex-end;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatDialogModule,
    MatxFullWidthFormFields,
    FormlyForm,
  ],
})
export class FormDialog {
  protected data = inject<{
    title: string;
    fields: FormlyFieldConfig[];
    model: any;
  }>(MAT_DIALOG_DATA);
  protected form: UntypedFormArray | UntypedFormGroup;

  private dialogRef = inject(MatDialogRef<FormDialog>);

  constructor() {
    this.form = Array.isArray(this.data.model)
      ? new UntypedFormArray([])
      : new UntypedFormGroup({});
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
