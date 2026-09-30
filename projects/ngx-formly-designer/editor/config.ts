import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldTypesReader } from './services/field-types-reader';
import { DataValidator } from './services/data-validator';
import { InitialValueFactory } from './services/initial-value-factory';
import { EditorFieldsReader } from './services/editor-fields-reader';
import { EditorConfigReader } from './services/editor-config-reader';
import { DropContainerManager } from './services/drop-container-manager';
import { FORMLY_EDITOR_CONFIG } from './constants';

export interface EditorConfig {
  groupTypes?: string[];
  formRenderConfig?: FormRenderConfig;
  properties?: { [key: string]: FormlyFieldConfig };
  propertiesByType?: { [key: string]: string[] };
}

export interface FormRenderConfig {
  editFormFieldConverter: (field: FormlyFieldConfig) => void;
  testFormFieldConverter: (field: FormlyFieldConfig) => void;
}

export function provideFormlyEditor(config: EditorConfig) {
  return [
    {
      provide: FORMLY_EDITOR_CONFIG,
      useValue: config,
    },
    EditorConfigReader,
    EditorFieldsReader,
    FieldTypesReader,
    DataValidator,
    InitialValueFactory,
    DropContainerManager,
  ];
}
