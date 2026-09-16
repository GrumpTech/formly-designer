import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, Observable, of } from 'rxjs';
import { IFileService } from '@grumptech/ngx-matx/explorer';
import { IFormsLoader } from '@grumptech/ngx-formly-ui-base';
import { jsonParse } from '@grumptech/formly-converters';

@Injectable()
export class FormLoader implements IFormsLoader {
  private fileService = inject(IFileService);

  load(name: string): Observable<FormlyFieldConfig[]> {
    if (name == '') {
      return of([]);
    }
    return this.fileService
      .load(`${name}.json`)
      .pipe(map((data) => jsonParse(data).result));
  }

  loadNames(): Observable<string[]> {
    return this.fileService
      .list()
      .pipe(map((names) => names.map((i) => i.replace(/.json$/g, ''))));
  }
}
