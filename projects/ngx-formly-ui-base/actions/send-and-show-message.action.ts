import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpActionBase } from './http.action.base';
import { ActionProps } from '../models';

@Injectable()
export class SendAndShowMessageAction extends HttpActionBase {
  get name() {
    return 'send-and-show-message';
  }

  protected handleSuccess(
    field: FormlyFieldConfig<ActionProps>,
    data: any,
    headers: HttpHeaders,
  ): void {
    const pageField = field.parent;
    if (pageField) {
      const url = this.getUrlFromLocation(field, headers);
      url &&
        this.pageService.setData(pageField, ['newItemUrl'], {
          newItemUrl: url,
        });
      if (field.props?.responseType === 'text') {
        this.pageService.setData(pageField, ['message'], { message: data });
      }
    }
  }
}
