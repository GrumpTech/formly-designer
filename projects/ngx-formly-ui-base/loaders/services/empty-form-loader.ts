import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { IFormLoader } from '@grumptech/ngx-formly-ui-base/defs';

@Injectable()
export class EmptyFormLoader implements IFormLoader {
  load(name: string) {
    return of([]);
  }
}
