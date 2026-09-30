import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FieldType,
  FormlyFieldConfig,
  FormlyFieldProps,
} from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormDialog } from '../form-dialog/form-dialog.component';

interface ArrayDialogProps extends FormlyFieldProps {
  field: FormlyFieldConfig;
  dialogTitle: string;
  width: 700;
  height: 500;
}

@Component({
  selector: 'formly-editor-array-dialog',
  templateUrl: './array-dialog.type.html',
  styleUrl: './array-dialog.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInput, MatIcon],
})
export class FormlyEditorArrayDialog extends FieldType<
  FormlyFieldConfig<ArrayDialogProps>
> {
  private dialog = inject(MatDialog);
  private viewContainerRef = inject(ViewContainerRef);

  protected getText(): string {
    const key = this.key?.toString();
    const items = key ? this.form.get(key)?.value : [];
    const nItems = items instanceof Array ? items.length : 0;
    return nItems === 1 ? `${nItems} item` : `${nItems} items`;
  }

  protected openDialog(): void {
    const key = this.key?.toString();
    if (!key) {
      return;
    }
    const model = structuredClone(this.form.get(key)?.value ?? []);
    const dialogRef = this.dialog.open(FormDialog, {
      viewContainerRef: this.viewContainerRef,
      width: `${this.props.width ?? 500}px`,
      height: `${this.props.height ?? 400}px`,
      data: {
        title: this.props.dialogTitle,
        fields: [
          {
            type: 'formly-editor-grid',
            props: {
              sortable: true,
              emptyArrayMessage: 'No items yet',
            },
            fieldArray: structuredClone(this.props.field),
          },
        ],
        model: model,
      },
    });
    dialogRef.afterClosed().subscribe((result: Array<any>) => {
      if (result) {
        result = result.filter((i) => i !== undefined);
        this.formControl.markAsDirty();
        this.form.get(key)?.patchValue(result);
      }
    });
  }
}
