import { Injectable, inject } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Form, FORMLY_APP_FORM_NAME } from '@grumptech/formly-converters';
import { ImportService } from './import-service';

@Injectable()
export class FormLoaderFromImporter {
  private importService = inject(ImportService);
  private forms?: Map<string, Form>;
  private initialized = false;
  private errorMessage = '';

  load(name: string): Observable<FormlyFieldConfig[]> {
    if (this.errorMessage) {
      return of(this.createAppErrorFields('Error', this.errorMessage));
    } else if (this.initialized) {
      return of(structuredClone(this.forms?.get(name)?.fields) ?? []);
    }
    return this.initialize().pipe(switchMap(() => this.load(name)));
  }

  loadNames(): Observable<string[]> {
    if (this.errorMessage) {
      return of([FORMLY_APP_FORM_NAME]);
    }
    if (this.initialized) {
      return of([...(this.forms?.values() ?? [])].map((i) => i.name));
    }
    return this.initialize().pipe(switchMap(() => this.loadNames()));
  }

  private initialize(): Observable<void> {
    return this.importService.import().pipe(
      map((result) => {
        this.forms = new Map(result.result.map((i) => [i.name, i]));
        this.errorMessage = result.success ? '' : result.message;
        this.initialized = true;
        return void 0;
      }),
    );
  }

  private createAppErrorFields(
    title: string,
    message: string,
  ): FormlyFieldConfig[] {
    return [
      {
        type: 'app-message-container',
        fieldGroup: [{ type: 'error-message', props: { title, message } }],
      },
    ];
  }
}
