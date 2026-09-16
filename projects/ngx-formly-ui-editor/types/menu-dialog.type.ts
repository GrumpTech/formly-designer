import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MenuItem } from '@grumptech/formly-converters';
import { MenuDialog } from '../components/menu-dialog.component';

@Component({
  selector: 'formly-editor-menu-dialog',
  template: `
    <mat-form-field
      floatLabel="always"
      class="clickable"
      (click)="openDialog()"
    >
      <mat-label>{{ props.label }}</mat-label>
      <input
        matInput
        readonly
        [value]="getText()"
        (keydown.enter)="openDialog()"
      />
      <mat-icon matSuffix>edit</mat-icon>
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field.clickable,
      mat-form-field.clickable input {
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInput, MatIcon],
})
export class FormlyEditorMenuDialog extends FieldType<FormlyFieldConfig> {
  private dialog = inject(MatDialog);
  private viewContainerRef = inject(ViewContainerRef);

  protected getText(): string {
    const key = this.key?.toString();
    const items = key ? this.form.get(key)?.value : [];
    const nItems =
      items instanceof Array ? this.calculateNumberOfItemsRecursive(items) : 0;
    return nItems === 1 ? `${nItems} item` : `${nItems} items`;
  }

  protected openDialog(): void {
    const key = this.key?.toString();
    if (!key) {
      return;
    }
    const model = structuredClone(this.form.get(key)?.value ?? []);
    const dialogRef = this.dialog.open(MenuDialog, {
      viewContainerRef: this.viewContainerRef,
      width: '700px',
      height: '700px',
      data: model,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.length === 1 && result[0] === undefined) {
          result = [];
        }
        this.formControl.markAsDirty();
        this.form.get(key)?.patchValue(result);
      }
    });
  }

  private calculateNumberOfItemsRecursive(items: MenuItem[]): number {
    return (
      items.length +
      items.reduce(
        (r, i) => r + this.calculateNumberOfItemsRecursive(i.children ?? []),
        0,
      )
    );
  }
}
