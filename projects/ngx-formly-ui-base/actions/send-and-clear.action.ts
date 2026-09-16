import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpActionBase } from './http.action.base';
import { ActionProps } from '../models';

@Injectable()
export class SendAndClearAction extends HttpActionBase {
  get name() {
    return 'send-and-clear';
  }

  protected handleSuccess(
    field: FormlyFieldConfig<ActionProps>,
    _data: any,
    headers: HttpHeaders,
  ): void {
    this.messageService.showMessage('success', 'Successfully saved');
    const groups = (field.props?.inputGroups ?? []).filter(
      (i) => i !== 'path' && i !== 'query',
    );
    const pageField = field.parent;
    if (pageField) {
      this.pageService.clearData(pageField, groups);
      const url = this.getUrlFromLocation(field, headers);
      url &&
        this.pageService.setData(pageField, ['newItemUrl'], {
          newItemUrl: url,
        });
    }
  }
}
