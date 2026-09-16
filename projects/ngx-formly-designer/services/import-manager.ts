import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, tap } from 'rxjs';
import {
  ImportManagerBase,
  NameAndData,
  Result,
} from '@grumptech/ngx-matx/editor-app';
import { validateArray } from '@grumptech/formly-field-validator';
import { clean } from '@grumptech/formly-converters';
import { Importer } from '../classes/importer';
import { FORMLY_DESIGNER_IMPORTERS } from '../constants';

@Injectable()
export class ImportManager extends ImportManagerBase<FormlyFieldConfig[]> {
  constructor() {
    super();
    const importers =
      inject(FORMLY_DESIGNER_IMPORTERS, { optional: true }) ?? [];
    super.set(importers.map((i) => new Importer(i)));
  }

  import(
    importerName: string,
    data: string,
    filename: string,
  ): Observable<Result<NameAndData<FormlyFieldConfig[]>[]>> {
    const result = super.import(importerName, data, filename).pipe(
      tap((i) => {
        let forms = i.result;
        forms.forEach((i) => clean(i.data));

        forms = forms.filter((i) => {
          const validationResult = validateArray(i.data);
          if (!validationResult.valid) {
            console.warn(
              'form name',
              i.name,
              'fields',
              i,
              'validation errors (Ajv)',
              validationResult.errors,
            );
          }
          return validationResult.valid;
        });
        const validatedResult = {
          success: i.success,
          message: i.message,
          result: forms,
        };
        validatedResult.success = i.success && i.result.length === forms.length;
      }),
    );
    return result;
  }
}
