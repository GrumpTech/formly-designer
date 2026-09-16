import { Provider, Type } from '@angular/core';
import { IFormsImporter } from '@grumptech/ngx-formly-importers';
import { IFormLoader, IFormsLoader } from '@grumptech/ngx-formly-ui-base';
import { ImportService } from './services/import-service';
import {
  FORMLY_IMPORT_APP_IMPORT_URL,
  FORMLY_IMPORT_APP_IMPORTER,
} from './constants';
import { FormLoaderFromImporter } from './services/form-loader-from-importer';

export interface ImporterConfig {
  importer: Type<IFormsImporter>;
  url: string;
}

export function provideFormsLoader(formsLoader: Type<IFormsLoader>): Provider {
  return [
    {
      provide: IFormsLoader,
      useClass: formsLoader,
    },
    {
      provide: IFormLoader,
      useExisting: IFormsLoader,
    },
  ];
}

export function provideFormsLoaderFromImporter(
  config: ImporterConfig,
): Provider {
  return [
    provideFormsLoader(FormLoaderFromImporter),
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
