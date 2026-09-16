import { FormlyFieldConfig } from '@ngx-formly/core';

export class FieldConfigBuilder {
  private fields: FormlyFieldConfig[] = [];
  private parentByField = new Map<FormlyFieldConfig, FormlyFieldConfig>();

  build(): FormlyFieldConfig[] {
    return this.fields;
  }

  set(fields: FormlyFieldConfig[]): FieldConfigBuilder {
    this.fields = fields;
    this.fields.forEach((i) => this.addToMapsRecursive(i));
    return this;
  }

  add(
    field: FormlyFieldConfig,
    idx: number,
    parent?: FormlyFieldConfig,
  ): FieldConfigBuilder {
    let list = this.fields;
    if (parent) {
      parent.fieldGroup = parent.fieldGroup || [];
      list = parent.fieldGroup;
    }
    list.splice(idx, 0, field);
    this.addToMapsRecursive(field, parent);
    return this;
  }

  addToFieldArray(
    field: FormlyFieldConfig,
    parent: FormlyFieldConfig,
    first = true,
  ): FieldConfigBuilder {
    if (typeof parent.fieldArray === 'object') {
      field = {
        type: 'formly-group',
        fieldGroup: first
          ? [field, parent.fieldArray]
          : [parent.fieldArray, field],
      };
      this.removeFromMapsRecursive(parent.fieldArray);
    }
    parent.fieldArray = field;
    this.addToMapsRecursive(field, parent);
    return this;
  }

  insertAfter(
    field: FormlyFieldConfig,
    referenceField: FormlyFieldConfig,
  ): FieldConfigBuilder {
    const parent = this.parentByField.get(referenceField);
    if (parent?.fieldArray === referenceField) {
      return this.addToFieldArray(field, parent, false);
    }
    const index = this.getIndex(
      referenceField,
      parent?.fieldGroup || this.fields,
    );
    return this.add(field, index + 1, parent);
  }

  update(
    field: FormlyFieldConfig,
    newField: FormlyFieldConfig,
  ): FieldConfigBuilder {
    const parent = this.parentByField.get(field);
    if (parent && parent.fieldArray === field) {
      parent.fieldArray = newField;
    } else {
      const list = parent ? parent.fieldGroup || [] : this.fields;
      const idx = this.getIndex(field, list);
      list.splice(idx, 1, newField);
    }
    this.removeFromMapsRecursive(field);
    this.addToMapsRecursive(newField);
    return this;
  }

  remove(field: FormlyFieldConfig): FieldConfigBuilder {
    const parent = this.parentByField.get(field);
    if (parent && parent.fieldArray === field) {
      delete parent.fieldArray;
    } else {
      const list = parent ? parent.fieldGroup || [] : this.fields;
      const idx = this.getIndex(field, list);
      list.splice(idx, 1);
    }
    this.removeFromMapsRecursive(field);
    return this;
  }

  private getIndex(
    field: FormlyFieldConfig,
    list: FormlyFieldConfig[],
  ): number {
    const idx = list.indexOf(field);
    if (idx === -1) {
      throw new Error(
        `Formly builder: field not found: ${JSON.stringify(field)}`,
      );
    }
    return idx;
  }

  private addToMapsRecursive(
    field: FormlyFieldConfig,
    parent?: FormlyFieldConfig,
  ): void {
    if (parent) {
      this.parentByField.set(field, parent);
    }
    if (typeof field.fieldArray === 'object') {
      this.addToMapsRecursive(field.fieldArray, field);
    }
    field.fieldGroup?.forEach((i) => this.addToMapsRecursive(i, field));
  }

  private removeFromMapsRecursive(field: FormlyFieldConfig): void {
    this.parentByField.delete(field);
    if (typeof field.fieldArray === 'object') {
      this.removeFromMapsRecursive(field.fieldArray);
    }
    field.fieldGroup?.forEach((i) => this.removeFromMapsRecursive(i));
  }
}
