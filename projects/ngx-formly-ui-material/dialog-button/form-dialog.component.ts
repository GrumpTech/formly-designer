import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormLoader } from '@grumptech/ngx-formly-ui-base/loaders';

@Component({
  selector: 'formly-mat-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatDialogModule, FormLoader],
})
export class FormDialog {
  protected data = inject<{
    title: string;
    form?: string;
  }>(MAT_DIALOG_DATA);
}
