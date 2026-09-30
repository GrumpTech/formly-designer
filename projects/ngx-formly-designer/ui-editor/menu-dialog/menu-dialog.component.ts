import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { UntypedFormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {
  DragDropNode,
  DroppedEvent,
  MatxDragDropTree,
} from '@grumptech/ngx-matx/drag-drop-tree';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MenuItem } from '@grumptech/ngx-basic-ui/navigation';
import { MatxFullWidthFormFields } from '@grumptech/ngx-matx/full-width-form-fields';

@Component({
  selector: 'formly-editor-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButton,
    FormlyForm,
    MatxDragDropTree,
    MatxFullWidthFormFields,
  ],
})
export class MenuDialog implements AfterViewInit {
  protected data = inject<MenuItem[]>(MAT_DIALOG_DATA);
  protected disabled = signal(true);
  protected form = new UntypedFormGroup({});
  protected fields: FormlyFieldConfig[] = [
    {
      type: 'formly-editor-group',
      fieldGroup: [
        {
          key: 'name',
          type: 'formly-editor-input',
          props: { label: 'name' },
        },
        {
          key: 'url',
          type: 'formly-editor-input',
          props: { label: 'url' },
        },
      ],
    },
  ];
  protected model = signal<MenuItem | null>(null);
  protected nodes = signal<DragDropNode<MenuItem>[]>([]);

  private dialogRef = inject(MatDialogRef<MenuDialog>);

  constructor() {
    this.nodes.set(this.toDragDropNodes(this.data));
    this.dialogRef
      .keydownEvents()
      .pipe(takeUntilDestroyed())
      .subscribe((event: KeyboardEvent) => {
        if (event.key === 'Delete') {
          event.stopImmediatePropagation();
          this.deleteItem();
        }
      });
  }

  ngAfterViewInit() {
    this.form.disable();
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected addItem() {
    const selectedItem = this.model();
    const newItem = { name: '', children: [] };
    if (selectedItem) {
      const array = this.findArrayRecursive(selectedItem);
      if (array) {
        const index = array.indexOf(selectedItem);
        array.splice(index + 1, 0, newItem);
      }
    } else {
      this.data.push(newItem);
    }
    this.nodes.set(this.toDragDropNodes(this.data));
    this.selectItem(newItem);
  }

  protected deleteItem() {
    const selectedItem = this.model();
    if (selectedItem) {
      const array = this.findArrayRecursive(selectedItem);
      if (array) {
        const index = array.indexOf(selectedItem);
        array.splice(index, 1);
      }
      this.nodes.set(this.toDragDropNodes(this.data));
      this.model.set(null);
    }
  }

  protected selectItem(item: MenuItem): void {
    this.model.set(item);
    this.disabled.set(false);
    this.form.enable();
  }

  protected handleDropped(event: DroppedEvent<MenuItem>): void {
    if (event.currentArray === event.targetArray) {
      moveItemInArray(
        event.currentArray,
        event.currentIndex,
        event.targetIndex,
      );
    } else {
      event.targetArray.splice(
        event.targetIndex,
        0,
        event.currentArray[event.currentIndex],
      );
      event.currentArray.splice(event.currentIndex, 1);
    }
    const items = this.toMenuItems(this.nodes());
    this.data.splice(0, this.data.length, ...items);
    this.nodes.set(this.toDragDropNodes(this.data));
  }

  protected treeTrackBy(
    _index: number,
    item: DragDropNode<MenuItem>,
  ): MenuItem {
    return item.data;
  }

  protected isSelected(item: MenuItem): boolean {
    return item === this.model();
  }

  private toDragDropNodes(menu: MenuItem[]): DragDropNode<MenuItem>[] {
    return menu.map((i) => {
      return {
        data: i,
        childNodes: i.children ? this.toDragDropNodes(i.children) : [],
      };
    });
  }

  private toMenuItems(nodes: DragDropNode<MenuItem>[]): MenuItem[] {
    return nodes.map((node) => ({
      ...node.data,
      children: node.childNodes ? this.toMenuItems(node.childNodes) : [],
    }));
  }

  private findArrayRecursive(
    item: MenuItem,
    array: MenuItem[] = this.data,
  ): MenuItem[] | null {
    if (array.find((i) => i === item)) {
      return array;
    }
    for (let i = 0, l = array.length; i < l; i++) {
      var res = this.findArrayRecursive(item, array[i].children);
      if (res) {
        return res;
      }
    }
    return null;
  }
}
