import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpActionBase } from './http.action.base';
import { ActionProps } from '../models';

@Injectable()
export class LoadAction extends HttpActionBase {
  get name() {
    return 'load';
  }

  protected handleSuccess(
    field: FormlyFieldConfig<ActionProps>,
    data: any,
  ): void {
    const pageField = field.parent;
    if (!pageField) {
      return;
    }
    this.pageService.toggleVisible(pageField, ['result'], true);
    this.pageService.setData(pageField, ['result'], { result: data });
    this.pageService.toggleEnabled(pageField, ['result'], false);
  }

  protected handleError(field: FormlyFieldConfig<ActionProps>): void {
    const pageField = field.parent;
    if (!pageField) {
      return;
    }
    this.pageService.toggleVisible(pageField, ['result'], false);
    this.pageService.clearData(pageField, ['result']);
  }
}
