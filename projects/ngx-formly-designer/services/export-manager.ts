import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ExportManagerBase } from '@grumptech/ngx-matx/editor-app';
import { FORMLY_DESIGNER_EXPORTERS } from '../constants';

@Injectable()
export class ExportManager extends ExportManagerBase<FormlyFieldConfig[]> {
  constructor() {
    super();
    super.set(inject(FORMLY_DESIGNER_EXPORTERS, { optional: true }) ?? []);
  }
}
