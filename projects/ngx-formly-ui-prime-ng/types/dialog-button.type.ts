import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { DialogButtonProps } from '@grumptech/ngx-formly-ui-base';
import { ButtonDirective } from 'primeng/button';
import { FormDialog } from '../components/form-dialog.component';

@Component({
  selector: 'formly-p-dialog-button',
  template: `
    <button
      pButton
      type="button"
      [disabled]="formControl.disabled"
      (click)="showDialog()"
      class="'default-button"
    >
      {{ props.label }}
    </button>
    @if (visible()) {
      <formly-p-form-dialog
        [title]="props.label ?? ''"
        [visible]="true"
        [form]="props.form ?? ''"
        (onHide)="hideDialog()"
      />
    }
  `,
  styles: [
    `
      button {
        min-width: 80px;
        margin-bottom: 15px;
        float: left;
      }
    `,
  ],
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
