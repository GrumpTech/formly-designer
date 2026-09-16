import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { DialogButtonProps } from '@grumptech/ngx-formly-ui-base';
import { FormDialog } from '../components/form-dialog.component';

@Component({
  selector: 'formly-mat-dialog-button',
  template: `
    <button
      mat-stroked-button
      type="button"
      [disabled]="formControl.disabled"
      (click)="openDialog()"
    >
      {{ props.label }}
    </button>
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
  imports: [MatButton],
})
export class FormlyDialogButton extends FieldType<
  FieldTypeConfig<DialogButtonProps>
> {
  private dialog = inject(MatDialog);
  private viewContainerRef = inject(ViewContainerRef);

  protected openDialog(): void {
    const key = this.key?.toString();
    if (!key) {
      return;
    }
    const label = this.props.label ?? '';
    this.dialog.open(FormDialog, {
      viewContainerRef: this.viewContainerRef,
      width: '700px',
      data: {
        title: label[0].toUpperCase() + label.slice(1),
        form: this.props.form,
      },
    });
  }
}
