import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, Observable } from 'rxjs';
import {
  MatxDragDropTree,
  DragDropNode,
  DroppedEvent,
} from '@grumptech/ngx-matx/drag-drop-tree';
import { DataManager } from '../../services/data-manager';
import { FieldTypesReader } from '../../services/field-types-reader';
import { SelectionManager } from '../../services/selection-manager';
import { DataValidator } from '../../services/data-validator';

@Component({
  selector: 'formly-designer-result-structure',
  templateUrl: './result-structure.component.html',
  styleUrl: './result-structure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatxDragDropTree, MatIcon],
})
export class ResultStructureComponent implements OnInit {
  nodes!: Observable<DragDropNode<FormlyFieldConfig>[]>;
  fieldTypes: readonly string[] = [];

  private formlyFieldTypes = inject(FieldTypesReader);
  private dataManager = inject(DataManager);
  private dataValidator = inject(DataValidator);
  private selection = inject(SelectionManager<FormlyFieldConfig>);
  private validationMessages?: Map<FormlyFieldConfig, string>;
  private changeDectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    this.fieldTypes = this.formlyFieldTypes.get();
    this.nodes = this.dataManager.onChange.pipe(
      map((fields: FormlyFieldConfig[]) => {
        this.validationMessages = this.dataValidator.validate(fields);
        return this.toDragDropNodes(fields);
      }),
    );
    this.selection.onSelect.subscribe(() =>
      this.changeDectorRef.detectChanges(),
    );
  }

  protected handleDropped(event: DroppedEvent<FormlyFieldConfig>) {
    this.dataManager.moveField(
      event.currentArray[event.currentIndex].data,
      event.targetIndex,
      event.targetParent?.data,
    );
  }

  protected handleClick(field: FormlyFieldConfig, event: MouseEvent) {
    this.selection.select(field, event.ctrlKey, event.shiftKey);
  }

  protected isSelected(field: FormlyFieldConfig): boolean {
    return this.selection.has(field);
  }

  protected getFieldType(field: FormlyFieldConfig): string {
    return this.formlyFieldTypes.getType(field);
  }

  protected treeTrackBy(
    _index: number,
    item: DragDropNode<FormlyFieldConfig>,
  ): FormlyFieldConfig {
    return item.data;
  }

  protected getWarning(field: FormlyFieldConfig): string | undefined {
    return this.validationMessages?.get(field);
  }

  private toDragDropNodes(
    fields: FormlyFieldConfig[],
  ): DragDropNode<FormlyFieldConfig>[] {
    return fields.map((i) => {
      if (this.formlyFieldTypes.isFieldGroup(i)) {
        return {
          data: i,
          childNodes: this.toDragDropNodes(i.fieldGroup || []),
        };
      }
      if (this.formlyFieldTypes.isFieldArray(i)) {
        return {
          data: i,
          childNodes:
            typeof i.fieldArray === 'object'
              ? this.toDragDropNodes([i.fieldArray])
              : [],
        };
      }
      return { data: i };
    });
  }
}
