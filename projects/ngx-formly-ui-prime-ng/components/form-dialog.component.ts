import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormLoader } from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'formly-p-form-dialog',
  template: `
    <p-dialog
      [header]="title()"
      [modal]="true"
      [visible]="visible()"
      [style]="{ width: '25rem' }"
      (onHide)="hide()"
    >
      <formly-form-loader [name]="form()" />
    </p-dialog>
  `,
  styles: [
    `
      [mat-dialog-actions] {
        justify-content: flex-end;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule, FormLoader],
})
export class FormDialog {
  visible = model(false);
  title = input('');
  form = input('');
  onHide = output();

  protected hide(): void {
    this.onHide.emit();
  }
}
