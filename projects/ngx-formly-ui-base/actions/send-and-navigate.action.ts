import { inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpActionBase } from './http.action.base';
import { ActionProps } from '../models';
import { Router } from '@angular/router';

@Injectable()
export class SendAndNavigateAction extends HttpActionBase {
  private router = inject(Router);

  get name() {
    return 'send-and-navigate';
  }

  protected handleSuccess(
    field: FormlyFieldConfig<ActionProps>,
    _data: any,
    headers: HttpHeaders,
  ): void {
    const url = this.getUrlFromLocation(field, headers);
    url && this.router.navigateByUrl(url);
  }
}
