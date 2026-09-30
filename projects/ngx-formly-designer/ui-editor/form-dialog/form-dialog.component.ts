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
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
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
