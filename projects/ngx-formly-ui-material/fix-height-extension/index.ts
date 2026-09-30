import { FormlyExtension } from '@ngx-formly/core';

export function withFormlyExtensionFixHeight() {
  return {
    extensions: [
      {
        name: 'fixHeight',
        extension: fixHeightExtension,
      },
    ],
  };
}

const fixHeightExtension: FormlyExtension = {
  prePopulate(field): void {
    if (
      field.type === 'checkbox' ||
      field.type === 'boolean' ||
      field.type === 'link'
    ) {
      field.className ??= '';
      if (
        field.className.indexOf('formly-fixed-height-mat-form-field') === -1
      ) {
        field.className =
          `${field.className} formly-fixed-height-mat-form-field`.trimStart();
      }
    }
  },
};
