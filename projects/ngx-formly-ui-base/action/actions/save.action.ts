import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpActionBase } from './http.action.base';
import { ActionProps } from '../models';

@Injectable()
export class SaveAction extends HttpActionBase {
  get name() {
    return 'save';
  }

  protected handleSuccess(
    field: FormlyFieldConfig<ActionProps>,
    data: any,
  ): void {
    const pageField = field.parent;
    if (!pageField) {
      return;
    }
    this.pageService.updateInitialValue(pageField);
    this.pageService.toggleEnabled(pageField, ['result'], false);
    this.messageService.showMessage('success', 'Successfully saved');
    if (field.props?.responseType === 'json') {
      this.pageService.setData(pageField, ['body'], { body: data });
    }
  }

  protected handleError(field: FormlyFieldConfig<ActionProps>): void {
    field.parent &&
      this.pageService.toggleEnabled(field.parent, ['result'], true);
  }
}
