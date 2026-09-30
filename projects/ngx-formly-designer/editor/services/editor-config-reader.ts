import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormRenderConfig } from '../config';
import { defaultEditorConfig } from '../defaults';
import { FORMLY_EDITOR_CONFIG } from '../constants';

@Injectable()
export class EditorConfigReader {
  public readonly groupTypes: string[];
  public readonly properties: { [key: string]: FormlyFieldConfig };
  public readonly propertiesByType: { [key: string]: string[] };
  public readonly formRenderConfig: FormRenderConfig;

  constructor() {
    const config = inject(FORMLY_EDITOR_CONFIG);
    const defaults = defaultEditorConfig;
    this.groupTypes = config.groupTypes ?? defaults.groupTypes ?? [];
    this.properties = Object.assign({}, defaults.properties, config.properties);
    this.propertiesByType = Object.assign(
      {},
      defaults.propertiesByType,
      config.propertiesByType,
    );
    this.formRenderConfig = Object.assign(
      {},
      defaults.formRenderConfig,
      config.formRenderConfig,
    );
  }
}
