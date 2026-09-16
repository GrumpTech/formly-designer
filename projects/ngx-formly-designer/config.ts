import { Provider, Type } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  EditorConfig,
  provideFormlyEditor,
} from '@grumptech/ngx-formly-editor';
import { IFormsImporter, JsonImporter } from '@grumptech/ngx-formly-importers';
import { IExporter } from '@grumptech/ngx-matx/editor-app';
import { JsonExporter } from '@grumptech/ngx-formly-editor';
import { ImportManager } from './services/import-manager';
import { ExportManager } from './services/export-manager';
import {
  FORMLY_DESIGNER_EXPORTERS,
  FORMLY_DESIGNER_IMPORTERS,
} from './constants';
import {
  provideExplorer,
  provideLocalStorageExplorer,
} from '@grumptech/ngx-matx/explorer';

export interface DesignerConfig {
  storage: 'file' | 'local';
  fileServiceUrl?: string;
  storagePrefix?: string;
  importers?: Type<IFormsImporter>[];
  exporters?: Type<IExporter<FormlyFieldConfig[]>>[];
  editor?: EditorConfig;
}

export function provideFormlyDesigner(config: DesignerConfig) {
  const providers: Provider[] = [ImportManager, ExportManager];
  (config.importers ?? [JsonImporter]).forEach((i) => {
    providers.push({
      provide: FORMLY_DESIGNER_IMPORTERS,
      useExisting: i,
      multi: true,
    });
  });
  (config.exporters ?? [JsonExporter]).forEach((i) => {
    providers.push({
      provide: FORMLY_DESIGNER_EXPORTERS,
      useExisting: i,
      multi: true,
    });
  });
  if (config.storage === 'local') {
    providers.push(
      provideLocalStorageExplorer(`${config.storagePrefix ?? ''}files_`),
    );
  } else if (config.fileServiceUrl) {
    providers.push(provideExplorer(config.fileServiceUrl));
  }
  return providers.concat(provideFormlyEditor(config.editor ?? {}));
}
