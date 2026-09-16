import { InjectionToken } from '@angular/core';
import { IFormsImporter } from '@grumptech/ngx-formly-importers';

export const FORMLY_IMPORT_APP_IMPORTER = new InjectionToken<IFormsImporter>(
  'formlyFormLoadersImporter',
);

export const FORMLY_IMPORT_APP_IMPORT_URL = new InjectionToken<string>(
  'formlyFormLoadersImportUrl',
);
