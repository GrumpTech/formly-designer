import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { catchError, combineLatest, EMPTY, map, Observable, timer } from 'rxjs';
import { PageService } from '../services/page-service';
import { HttpCacheService } from '../services/http-cache-service';
import { IAction, IMessageService, ActionProps } from '../models';
import { FORMLY_APP_CONFIG } from '../config';

@Injectable()
export abstract class HttpActionBase extends IAction {
  protected pageService = inject(PageService);
  protected messageService = inject(IMessageService);

  private httpClient = inject(HttpClient);
  private httpCacheService = inject(HttpCacheService);
  private appConfig = inject(FORMLY_APP_CONFIG);

  run(field: FormlyFieldConfig<ActionProps>): Observable<void> {
    this.messageService.clearMessages();
    if (!this.isValidFieldConfig(field)) {
      return EMPTY;
    }
    const pageField = field.parent!;
    const inputGroups = field.props?.inputGroups ?? [];
    let url = field.props!.url!;
    const method = field.props!.method!.toUpperCase();
    if (!this.pageService.isValid(pageField, inputGroups)) {
      this.handleError(field);
      return EMPTY;
    }
    const { path, query, body, result } = this.pageService.getData(
      pageField,
      inputGroups,
    );
    const options: any = { observe: 'response' };
    if (field.props?.responseType) {
      options.responseType = field.props.responseType;
    }
    if (body || result) {
      options.body = body ?? result;
    }
    this.clearCache(url, path, method);
    if (path) {
      for (const key in path) {
        url = url.replace(`{${key}}`, path[key]);
      }
    }
    if (query) {
      options.params = new HttpParams().appendAll(query);
    }
    this.pageService.setData(pageField, ['message', 'newItemUrl'], {
      newItemUrl: '',
      message: '',
    });
    this.pageService.toggleEnabled(pageField, inputGroups, false);
    this.pageService.toggleActionsEnabled(pageField, false);
    return combineLatest([
      this.httpClient.request(
        method,
        `${this.appConfig.baseUrl}${url}`,
        options,
      ),
      timer(300),
    ]).pipe(
      map((data) => {
        this.pageService.toggleEnabled(pageField, inputGroups, true);
        this.pageService.toggleActionsEnabled(pageField, true);
        const response = data[0] as unknown as HttpResponse<any>;
        this.handleSuccess(field, response.body, response.headers);
        return void 0;
      }),
      catchError((error) => {
        this.pageService.toggleEnabled(pageField, inputGroups, true);
        this.pageService.toggleActionsEnabled(pageField, true);
        this.handleError(field);
        this.showErrorMessage(field, error);
        return EMPTY;
      }),
    );
  }

  protected handleSuccess(
    field: FormlyFieldConfig<ActionProps>,
    data: any,
    headers: HttpHeaders,
  ): void {}

  protected handleError(field: FormlyFieldConfig<ActionProps>): void {}

  protected showErrorMessage(
    field: FormlyFieldConfig<ActionProps>,
    error: any,
  ): void {
    const actionLabel = field.props?.label;
    let message = '';
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
        case 403:
          message = 'No access';
          break;
        case 404:
          message = 'Item not found';
          break;
        case 503:
          message = 'Service unavailable or internet connection problems';
          break;
        default:
          message = `Error occurred: try again or contact support`;
      }
    } else {
      message = actionLabel
        ? `Action '${actionLabel}' failed`
        : 'Action failed';
    }
    this.messageService.showMessage('error', message);
  }

  protected clearCache(url: string, path: any, method: string) {
    if (
      method === 'POST' ||
      method === 'PUT' ||
      method === 'DELETE' ||
      method === 'PATCH'
    ) {
      if (method !== 'POST') {
        let match: RegExpMatchArray | null = null;
        do {
          match = url.match(/\/\{([^}]*)\}$/);
          if (match && match[1] in path) {
            url = url.substring(0, url.length - match[0].length);
          }
        } while (match);
      }
      this.httpCacheService.clearCache(url);
    }
  }

  protected getUrlFromLocation(
    field: FormlyFieldConfig<ActionProps>,
    headers: HttpHeaders,
  ): string {
    const location = headers.get('Location');
    if (!location) {
      return '';
    }
    const url = new URL(location).pathname;
    const path = window.location.pathname;
    const actionUrl = field.props?.url;
    if (actionUrl) {
      const position = path.indexOf(actionUrl);
      if (position !== -1) {
        return `${path.substring(0, position)}${url}`;
      }
    }
    return `${this.appConfig.frontendBaseUrl}${url.replace(/^\//, '')}`;
  }

  private isValidFieldConfig(field: FormlyFieldConfig<ActionProps>): boolean {
    if (field.parent?.type !== 'page') {
      console.warn('Parent of an action should be a page.');
      return false;
    }
    if (!field.props?.url) {
      console.warn('Action does not have url property.');
      return false;
    }
    if (!field.props?.method) {
      console.warn('Action does not have method property.');
      return false;
    }
    return true;
  }
}
