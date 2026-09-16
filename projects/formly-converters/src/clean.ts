import { FormlyFieldConfig } from '@ngx-formly/core';
import { toFlatArray } from './flatten';

export function clean(fields: FormlyFieldConfig[]): void {
  toFlatArray(fields).forEach((i) => {
    if (i.templateOptions) {
      delete i.templateOptions;
    }
    if (i.validators) {
      delete i.validators;
    }
    if (i.parsers) {
      delete i.parsers;
    }
  });
}

export function cleanInput(field: FormlyFieldConfig) {
  return cleanInputRecursive(field);
}

function cleanInputRecursive(object: any): void {
  for (const key in object) {
    if (typeof object[key] === 'object' && object[key]) {
      if (!Array.isArray(object[key])) {
        cleanInputRecursive(object[key]);
      }
      if (key !== 'defaultValue' && !Object.keys(object[key]).length) {
        delete object[key];
      }
    } else if (object[key] === undefined) {
      delete object[key];
    }
  }
}
