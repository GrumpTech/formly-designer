import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EMPTY, Observable } from 'rxjs';
import { ActionProps, IMessageService, LoadActionProps } from '../models';
import { FORMLY_APP_ACTIONS } from '../config';
import { PageService } from './page-service';

@Injectable()
export class ActionService {
  private pageService = inject(PageService);
  private messageService = inject(IMessageService);
  private actions = inject(FORMLY_APP_ACTIONS, { optional: true }) ?? [];

  run(field: FormlyFieldConfig<ActionProps>): Observable<void> {
    if (!field.props?.action) {
      console.warn('No action specified in field config');
      return EMPTY;
    }
    const action = this.actions.find((i) => i.name === field.props?.action);
    if (!action) {
      console.warn(`Unknown action in field config: ${field.props?.action}`);
      return EMPTY;
    }
    return action.run(field);
  }

  validate(field: FormlyFieldConfig<ActionProps>): boolean {
    const parent = field.parent;
    if (parent?.type !== 'page') {
      console.warn('Parent of an action should be a page.');
      return false;
    }
    return this.pageService.validate(parent, field.props?.inputGroups ?? []);
  }

  validateSelectionIsNotChanged(
    field: FormlyFieldConfig<ActionProps>,
  ): boolean {
    const parent = field.parent;
    if (parent?.type !== 'page') {
      console.warn('Parent of an action should be a page.');
      return false;
    }
    if (
      field.key === 'result-buttons' &&
      this.pageService.isChanged(parent, ['path', 'query', 'body'])
    ) {
      this.pageService.toggleVisible(parent, ['result'], false);
      this.messageService.showMessage('error', 'Select new item first.');
      return false;
    }
    return true;
  }

  getData(field: FormlyFieldConfig<ActionProps>): any {
    if (field.parent?.type !== 'page') {
      console.warn('Parent of an action should be a page.');
    }
    return field.parent
      ? this.pageService.getData(field.parent, field.props?.inputGroups ?? [])
      : {};
  }

  shouldHide(field: FormlyFieldConfig<LoadActionProps>): boolean {
    const inputGroups = field.props?.inputGroups ?? [];
    return (
      (field.type === 'load-action' &&
        field.props?.autoRun &&
        field.parent &&
        this.pageService.isHidden(field.parent, inputGroups)) ??
      false
    );
  }

  isNavigationEnabled(field: FormlyFieldConfig<ActionProps>): boolean {
    return (
      (field.parent && this.pageService.isNavigationEnabled(field.parent)) ??
      false
    );
  }
}
