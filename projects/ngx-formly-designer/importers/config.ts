import { Provider, Type } from '@angular/core';
import { ImportService } from './services/import-service';
import {
  FORMLY_IMPORT_APP_IMPORT_URL,
  FORMLY_IMPORT_APP_IMPORTER,
} from './constants';
import { IFormsImporter } from './models';

export interface ImporterConfig {
  importer: Type<IFormsImporter>;
  url: string;
}

export function provideImporter(config: ImporterConfig): Provider {
  return [
    {
      provide: FORMLY_IMPORT_APP_IMPORTER,
      useExisting: config.importer,
    },
    {
      provide: FORMLY_IMPORT_APP_IMPORT_URL,
      useValue: config.url,
    },
    ImportService,
  ];
}
