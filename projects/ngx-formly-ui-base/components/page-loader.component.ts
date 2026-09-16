import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { AppService } from '../services/app-service';

@Component({
  selector: 'formly-page-loader',
  template: `<formly-form
    [form]="form"
    [model]="model()"
    [fields]="fields()"
  />`,
  styles: [
    `
      formly-form {
        width: 100%;
        height: 100%;
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyForm],
})
export class PageLoader {
  protected appService = inject(AppService);
  protected form = new FormGroup({});
  protected model = signal<any>({});
  protected fields: Signal<FormlyFieldConfig[]>;

  constructor() {
    this.fields = this.appService.formFields;
    toObservable(this.appService.formFields)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (Object.keys(this.model()).length) {
          this.form.reset();
          Object.keys(this.form.controls).forEach((i) =>
            this.form.removeControl(i),
          );
          this.model.set({});
        }
      });
  }
}
