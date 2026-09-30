import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { DialogButtonProps } from '@grumptech/ngx-formly-ui-base/dialog-button';
import { FormDialog } from './form-dialog.component';

@Component({
  selector: 'formly-mat-dialog-button',
  templateUrl: './dialog-button.type.html',
  styleUrl: './dialog-button.type.scss',
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
