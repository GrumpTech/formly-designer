import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  ExtendedJsonSchemaImporter,
  ExtendedOpenApiAppImporter,
  ExtendedOpenApiImporter,
  JsonImporter,
} from '@grumptech/ngx-formly-importers';
import { DesignerConfig } from '@grumptech/ngx-formly-designer';
import { environment } from '../../environments/environment';

export const designerConfig: DesignerConfig = {
  storage: environment.storage,
  fileServiceUrl: '/file-service',
  storagePrefix: environment.storagePrefix,
  importers: [
    JsonImporter,
    ExtendedJsonSchemaImporter,
    ExtendedOpenApiImporter,
    ExtendedOpenApiAppImporter,
  ],
  editor: {
    formRenderConfig: {
      editFormFieldConverter: (field: FormlyFieldConfig) => {
        field.hide && delete field.hide;
        field.expressions && delete field.expressions;
        field.props?.url && delete field.props.url;
        field.props?.autoRun && delete field.props.autoRun;
      },
      testFormFieldConverter: (field: FormlyFieldConfig) => {
        field.type === 'page' &&
          (field.props ??= {}) &&
          (field.props.navigationDisabled = true);
      },
    },
  },
};
