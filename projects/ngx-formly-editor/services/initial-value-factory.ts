import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldTypesReader } from './field-types-reader';

@Injectable()
export class InitialValueFactory {
  private fieldTypesReader = inject(FieldTypesReader);

  create(fields: FormlyFieldConfig[], defaultArraySize: 0 | 1 = 0): any {
    const result = this.createRecursive(fields, defaultArraySize);
    return defaultArraySize ? result : Array.isArray(result) ? [] : {};
  }

  private createRecursive(
    fields: FormlyFieldConfig[],
    defaultArraySize: 0 | 1,
  ): any {
    const result: any = {};
    let arrayResult: any = null;
    fields.forEach((i) => {
      const value = this.createRecursiveForField(i, defaultArraySize);
      if (i.key) {
        result[`${i.key}`] = value;
      } else if (typeof value === 'object') {
        Array.isArray(value)
          ? (arrayResult = value)
          : Object.assign(result, value);
      }
    });
    return Object.keys(result).length ? result : arrayResult;
  }

  private createRecursiveForField(
    field: FormlyFieldConfig,
    defaultArraySize: 0 | 1,
  ) {
    if (this.fieldTypesReader.isFieldGroup(field) && field.fieldGroup) {
      return this.createRecursive(field.fieldGroup, defaultArraySize);
    }
    if (this.fieldTypesReader.isFieldArray(field)) {
      if (defaultArraySize === 0) {
        return [];
      }
      const fieldGroup =
        typeof field.fieldArray === 'object'
          ? field.fieldArray.fieldGroup
          : null;
      return fieldGroup
        ? [this.createRecursive(fieldGroup, defaultArraySize)]
        : [null];
    }
    return null;
  }
}
