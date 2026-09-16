import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpActionBase } from './http.action.base';
import { ActionProps } from '../models';

@Injectable()
export class SendAndCloseAction extends HttpActionBase {
  get name() {
    return 'send-and-close';
  }

  protected handleSuccess(
    field: FormlyFieldConfig<ActionProps>,
    _data: any,
  ): void {
    field.parent &&
      this.pageService.toggleVisible(field.parent, ['result'], false);
  }
}
