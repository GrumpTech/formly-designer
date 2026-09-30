import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditorConfig } from './config';
import { defaultProperties } from './default-properties';
import { defaultPropertiesByType } from './default-properties-by-type';

export const defaultEditorConfig: EditorConfig = {
  groupTypes: ['formly-group', 'object', 'page'],
  properties: defaultProperties,
  propertiesByType: defaultPropertiesByType,
  formRenderConfig: {
    editFormFieldConverter: (field: FormlyFieldConfig) => {
      field.hide && delete field.hide;
      field.expressions && delete field.expressions;
    },
    testFormFieldConverter: () => {},
  },
};
