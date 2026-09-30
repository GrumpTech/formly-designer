import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, of, switchMap, tap } from 'rxjs';
import { Result, Form, clean } from '@grumptech/formly-converters';
import {
  FORMLY_IMPORT_APP_IMPORT_URL,
  FORMLY_IMPORT_APP_IMPORTER,
} from '../constants';

@Injectable()
export class ImportService {
  private httpClient = inject(HttpClient);
  private importer = inject(FORMLY_IMPORT_APP_IMPORTER);
  private url = inject(FORMLY_IMPORT_APP_IMPORT_URL);

  import(): Observable<Result<Form[]>> {
    return this.httpClient.get(this.url, { responseType: 'text' }).pipe(
      switchMap((data) => from(this.importer.import(data, ''))),
      tap((formsResult) => {
        !formsResult.success &&
          (formsResult.message = `Fetching url from: "${this.url}". Error parsing definition: ${formsResult.message}`);
        formsResult.result.forEach((i) => clean(i.fields));
      }),
      catchError((error) => {
        console.error('Error message', error);
        const errorMessage =
          `Could not reach: ${this.url}.` +
          (this.url.indexOf('//') === -1
            ? ' Check server and proxy config.'
            : '');
        return of({ success: false, message: errorMessage, result: [] });
      }),
    );
  }
}
