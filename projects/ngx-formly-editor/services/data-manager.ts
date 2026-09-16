import { Injectable, OnDestroy, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UndoManager } from './undo-manager';
import { FieldConfigBuilder } from './field-config-builder';
import { FieldTypesReader } from './field-types-reader';
import { SelectionManager } from './selection-manager';

@Injectable()
export class DataManager implements OnDestroy {
  readonly onChange: Observable<FormlyFieldConfig[]>;

  private selection = inject(SelectionManager<FormlyFieldConfig>);
  private undoManager = inject(UndoManager<FormlyFieldConfig[]>);
  private formlyFieldTypes = inject(FieldTypesReader);
  private fields: FormlyFieldConfig[] = [];
  private change = new BehaviorSubject<FormlyFieldConfig[]>([]);

  constructor() {
    this.onChange = this.change.asObservable();
    this.undoManager.onChange.subscribe((state) => {
      this.selection.clear();
      this.fields.splice(0);
      this.fields.push(...state);
      this.change.next(this.fields);
    });
  }

  ngOnDestroy(): void {
    this.change.complete();
  }

  setFields(fields: FormlyFieldConfig[]): void {
    this.undoManager.clear();
    this.selection.clear();
    this.fields = fields;
    this.update();
  }

  getFields(): FormlyFieldConfig[] {
    return this.fields;
  }

  addFields(fields: FormlyFieldConfig[]): void {
    if (fields.length === 0) {
      return;
    }
    const selectedField = this.selection.getLast();
    const configBuilder = new FieldConfigBuilder().set(this.fields);
    if (!selectedField) {
      fields.forEach((i) => configBuilder.add(i, this.fields.length));
    } else if (this.formlyFieldTypes.isFieldGroup(selectedField)) {
      fields.forEach((i, idx) =>
        configBuilder.add(i, idx, selectedField ?? undefined),
      );
    } else if (!this.formlyFieldTypes.isFieldArray(selectedField)) {
      fields
        .reverse()
        .forEach((i) => configBuilder.insertAfter(i, selectedField));
    } else if (typeof selectedField.fieldArray === 'object') {
      configBuilder.update(selectedField.fieldArray, {
        type: 'formly-group',
        fieldGroup: [...fields, selectedField.fieldArray],
      });
    } else {
      configBuilder.addToFieldArray(
        fields.length > 1
          ? { type: 'formly-group', fieldGroup: fields }
          : fields[0],
        selectedField,
      );
    }
    this.update();
  }

  updateField(oldField: FormlyFieldConfig, newField: FormlyFieldConfig): void {
    const configBuilder = new FieldConfigBuilder().set(this.fields);
    configBuilder.update(oldField, newField);
    this.selection.replace(oldField, newField);
    this.update();
  }

  moveField(
    field: FormlyFieldConfig,
    targetIndex: number,
    target?: FormlyFieldConfig,
  ): void {
    const configBuilder = new FieldConfigBuilder().set(this.fields);
    configBuilder.remove(field);
    if (!target || !this.formlyFieldTypes.isFieldArray(target)) {
      configBuilder.add(field, targetIndex, target);
    } else {
      configBuilder.addToFieldArray(field, target, !targetIndex);
    }
    this.update();
  }

  removeSelectedFields(): void {
    const fields = this.getSelectedFields();
    if (fields.length) {
      const configBuilder = new FieldConfigBuilder().set(this.fields);
      fields.forEach((i) => configBuilder.remove(i));
      this.selection.clear();
      this.update();
    }
  }

  getSelectedFields(): FormlyFieldConfig[] {
    return this.getSelectedFieldsRecursive(this.fields);
  }

  private getSelectedFieldsRecursive(
    fields: FormlyFieldConfig[],
  ): FormlyFieldConfig[] {
    return fields.flatMap((i) => {
      if (this.selection.has(i)) {
        return i;
      }
      const children = (
        typeof i.fieldArray === 'object' ? [i.fieldArray] : []
      ).concat(i.fieldGroup || []);
      return this.getSelectedFieldsRecursive(children);
    });
  }

  private update(): void {
    this.undoManager.push(this.fields);
    this.change.next(this.fields);
  }
}
