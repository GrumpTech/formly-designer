import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { IFormLoader } from '../models';

@Component({
  selector: 'formly-form-loader',
  template: ` <formly-form [fields]="(fields | async) ?? []" /> `,
  styles: [
    `
      formly-form {
        width: 100%;
        height: 100%;
        display: block;
      }
    `,
  ],
  imports: [AsyncPipe, FormlyForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLoader implements OnInit {
  readonly name = input.required<string>();

  protected formLoader = inject(IFormLoader);
  protected fields?: Observable<FormlyFieldConfig[]>;

  ngOnInit() {
    this.fields = this.formLoader.load(this.name());
  }
}
