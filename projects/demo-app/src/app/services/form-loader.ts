import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { from, map, Observable, of } from 'rxjs';
import { IFormLoader } from '@grumptech/ngx-formly-ui-base';

@Injectable({ providedIn: 'root' })
export class FormLoader implements IFormLoader {
  load(name: string): Observable<FormlyFieldConfig[]> {
    if (name === '') {
      return of([]);
    }
    try {
      return from(import(`../forms/${name}.json`)).pipe(
        map(
          ({ default: data }: any) =>
            structuredClone(data) as FormlyFieldConfig[],
        ),
      );
    } catch {
      console.error('Form missing for this route.');
      return of([]);
    }
  }
}
