import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormLoader } from './form-loader.component';

@Component({
  selector: 'formly-app-loader',
  template: ` <formly-form-loader name="formly-app" /> `,
  imports: [FormLoader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLoader {}
