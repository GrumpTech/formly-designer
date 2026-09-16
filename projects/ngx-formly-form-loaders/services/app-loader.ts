import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { generateApp } from '@grumptech/formly-converters';
import { FORMLY_APP_FORM_NAME } from '@grumptech/ngx-formly-importers';
import { IFormsLoader } from '@grumptech/ngx-formly-ui-base';

@Injectable()
export class AppLoader implements IFormsLoader {
  private formsLoader = inject(IFormsLoader);
  private names?: string[];

  load(name: string): Observable<FormlyFieldConfig[]> {
    if (name === FORMLY_APP_FORM_NAME) {
      return this.loadNames().pipe(
        switchMap((names) =>
          names.find((i) => i === FORMLY_APP_FORM_NAME)
            ? this.formsLoader.load(name)
            : of(generateApp(names)),
        ),
      );
    }
    return this.formsLoader.load(name);
  }

  loadNames(): Observable<string[]> {
    if (this.names) {
      return of(this.names);
    }
    return this.formsLoader.loadNames().pipe(tap((n) => (this.names = n)));
  }
}
