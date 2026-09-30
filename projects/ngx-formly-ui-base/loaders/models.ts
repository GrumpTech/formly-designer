import { Observable } from 'rxjs';
import { IFormLoader } from '@grumptech/ngx-formly-ui-base/defs';

export abstract class IFormsLoader extends IFormLoader {
  abstract loadNames: () => Observable<string[]>;
}
