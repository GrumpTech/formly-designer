import { InjectionToken } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IFormsImporter } from '@grumptech/ngx-formly-importers';
import { IExporter } from '@grumptech/ngx-matx/editor-app';

export const FORMLY_DESIGNER_IMPORTERS = new InjectionToken<IFormsImporter[]>(
  'formlyDesignerImporters',
);
export const FORMLY_DESIGNER_EXPORTERS = new InjectionToken<
  IExporter<FormlyFieldConfig[]>[]
>('formlyDesignerExporters');
