import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsLoader as FormsLoaderService } from './services/forms-loader';
import { AppLoader } from './app-loader.component';
import { IFormLoader } from '@grumptech/ngx-formly-ui-base/defs';

@Component({
  selector: 'formly-forms-loader',
  template: `<formly-app-loader />`,
  imports: [AppLoader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IFormLoader, useClass: FormsLoaderService }],
})
export class FormsLoader {}
