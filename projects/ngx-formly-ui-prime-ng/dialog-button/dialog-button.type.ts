import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { DialogButtonProps } from '@grumptech/ngx-formly-ui-base/dialog-button';
import { ButtonDirective } from 'primeng/button';
import { FormDialog } from './form-dialog.component';

@Component({
  selector: 'formly-p-dialog-button',
  templateUrl: './dialog-button.type.html',
  styleUrl: './dialog-button.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, FormDialog],
})
export class FormlyDialogButton extends FieldType<
  FieldTypeConfig<DialogButtonProps>
> {
  protected visible = signal(false);

  protected showDialog(): void {
    this.visible.set(true);
  }

  protected hideDialog(): void {
    this.visible.set(false);
  }
}
