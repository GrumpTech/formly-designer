import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLoader, IFormLoader } from '@grumptech/ngx-formly-ui-base';
import { FormsLoader as FormsLoaderService } from '../services/forms-loader';

@Component({
  selector: 'formly-forms-loader',
  template: `<formly-app-loader />`,
  imports: [AppLoader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IFormLoader, useClass: FormsLoaderService }],
})
export class FormsLoader {}
