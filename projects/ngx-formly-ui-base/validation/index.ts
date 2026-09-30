import { FormlyFieldConfig } from '@ngx-formly/core';

export function withFormlyBaseValidation() {
  return {
    validationMessages: [
      { name: 'required', message: 'Field is required' },
      { name: 'null', message: 'Should be null' },
      { name: 'minLength', message: minLengthValidationMessage },
      { name: 'maxLength', message: maxLengthValidationMessage },
      { name: 'min', message: minValidationMessage },
      { name: 'max', message: maxValidationMessage },
      { name: 'multipleOf', message: multipleOfValidationMessage },
      {
        name: 'exclusiveMinimum',
        message: exclusiveMinimumValidationMessage,
      },
      {
        name: 'exclusiveMaximum',
        message: exclusiveMaximumValidationMessage,
      },
      { name: 'pattern', message: patternValidationMessage },
      { name: 'minItems', message: minItemsValidationMessage },
      { name: 'maxItems', message: maxItemsValidationMessage },
      { name: 'uniqueItems', message: 'Should NOT have duplicate items' },
      { name: 'const', message: constValidationMessage },
    ],
  };
}

function minItemsValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT have fewer than ${field.props?.minItems} items`;
}

function maxItemsValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT have more than ${field.props?.maxItems} items`;
}

function minLengthValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT be shorter than ${field.props?.minLength} characters`;
}

function maxLengthValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT be longer than ${field.props?.maxLength} characters`;
}

function minValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be >= ${field.props?.min}`;
}

function maxValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be <= ${field.props?.max}`;
}

function multipleOfValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be a multiple of ${field.props?.step}`;
}

function patternValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should follow pattern ${field.props?.pattern}`;
}

function exclusiveMinimumValidationMessage(
  _err: any,
  field: FormlyFieldConfig,
) {
  return `Should be > ${field.props?.step}`;
}

function exclusiveMaximumValidationMessage(
  _err: any,
  field: FormlyFieldConfig,
) {
  return `Should be < ${field.props?.step}`;
}

function constValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be equal to constant "${field.props?.const}"`;
}
