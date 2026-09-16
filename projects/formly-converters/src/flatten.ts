import { FormlyFieldConfig } from '@ngx-formly/core';

export function toFlatArray(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
  const result: FormlyFieldConfig[] = [];
  fields.forEach((i) => result.push(...toFlatArrayRecursive(i)));
  return result;
}

function toFlatArrayRecursive(field: FormlyFieldConfig): FormlyFieldConfig[] {
  const result = [field];
  if (typeof field.fieldArray === 'object') {
    result.push(...toFlatArrayRecursive(field.fieldArray));
  }
  field.fieldGroup?.forEach((i) => result.push(...toFlatArrayRecursive(i)));
  return result;
}
