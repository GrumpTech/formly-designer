import { FormlyFieldConfig } from '@ngx-formly/core';
import { ErrorObject } from 'ajv';
import {
  validateField,
  validateFields,
} from '@grumptech/formly-field-validator/validator.mjs';

export function validate(field: FormlyFieldConfig): {
  valid: boolean;
  errors: ErrorObject[];
} {
  const valid = validateField(field);
  if (valid) {
    return { valid: true, errors: [] };
  }
  return { valid: false, errors: (validateField as any).errors ?? [] };
}

export function validateArray(fields: FormlyFieldConfig[]): {
  valid: boolean;
  errors: ErrorObject[];
} {
  const valid = validateFields(fields);
  if (valid) {
    return { valid: true, errors: [] };
  }
  return { valid: false, errors: (validateFields as any).errors ?? [] };
}
