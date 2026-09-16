import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, Observable, switchMap } from 'rxjs';
import { IFormLoader } from '@grumptech/ngx-formly-ui-base';
import { FORMLY_APP_FORM_NAME } from '@grumptech/ngx-formly-importers';
import { generateMenu, generatePages } from '@grumptech/formly-converters';
import { AppLoader } from './app-loader';

@Injectable()
export class FormsLoader extends AppLoader implements IFormLoader {
  load(name: string): Observable<FormlyFieldConfig[]> {
    if (name === FORMLY_APP_FORM_NAME) {
      return this.loadNames()
        .pipe(
          switchMap((names) =>
            super.load(name).pipe(map((fields) => ({ fields, names }))),
          ),
        )
        .pipe(map(({ fields, names }) => this.changeAppMenu(fields, names)));
    }
    return super.load(name.replace(/\-([^\-\/\\]+)\-/g, '{$1}'));
  }

  private changeAppMenu(
    fields: FormlyFieldConfig[],
    names: string[],
  ): FormlyFieldConfig[] {
    if (fields.length) {
      fields = structuredClone(fields);
      names = names.filter((i) => i !== FORMLY_APP_FORM_NAME);
      names = names.concat(
        names
          .filter((i) => i.indexOf('{') !== -1)
          .map((i) => i.replace(/\{([^\{\}\/]+)\}/g, '-$1-')),
      );
      fields[0].props &&
        Object.assign(fields[0].props, {
          menu: generateMenu(names),
          pages: generatePages(names),
        });
    }
    return fields;
  }
}
