import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormLoader } from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'formly-mat-form-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <formly-form-loader [name]="data.form ?? ''" />
    </div>
    <div mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close color="primary">Close</button>
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
  imports: [MatButton, MatDialogModule, FormLoader],
})
export class FormDialog {
  protected data = inject<{
    title: string;
    form?: string;
  }>(MAT_DIALOG_DATA);
}
