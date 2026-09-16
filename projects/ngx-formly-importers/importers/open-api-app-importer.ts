import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  compareUrls,
  Form,
  generateApp,
  jsonParse,
  Result,
  toFailedArrayResult,
} from '@grumptech/formly-converters';
import { IFormsImporter } from '../models';
import { OpenApiImporter } from './open-api-importer';
import { FORMLY_APP_FORM_NAME } from '../config';

@Injectable({ providedIn: 'root' })
export class OpenApiAppImporter implements IFormsImporter {
  protected openApiImporter = inject(OpenApiImporter);

  private urlSuffixes: { [key: string]: string } = {
    get: '',
    post: 'new',
    put: 'edit',
    patch: 'patch',
    delete: 'delete',
  };
  private actionLabels: { [key: string]: string } = {
    get: 'Select',
    post: 'Save',
    put: 'Save',
    patch: 'Patch',
    delete: 'Delete',
  };
  private actionNames = {
    load: 'load',
    save: 'save',
    'send-and-clear': 'send-and-clear',
    'send-and-close': 'send-and-close',
    'send-and-show-message': 'send-and-show-message',
  };
  private actions: { [key: string]: string } = {
    get: this.actionNames['load'],
    post: this.actionNames['send-and-clear'],
    put: this.actionNames['send-and-clear'],
    patch: this.actionNames['send-and-clear'],
    delete: this.actionNames['send-and-clear'],
  };
  private contentTypeOrder = ['application/json', 'text/plain'];
  private responseTypes: { [key: string]: string } = {
    'application/json': 'json',
    'text/plain': 'text',
  };

  get name() {
    return 'OpenApi 3.0 app';
  }
  get hasMultipleFileSelection() {
    return false;
  }
  get extensions() {
    return ['json'];
  }

  async import(data: string, filename: string): Promise<Result<Form[]>> {
    const formsResult = await this.openApiImporter.import(data, filename);
    const parseResult = jsonParse(data);
    if (!parseResult.success) {
      return toFailedArrayResult(parseResult.message);
    }
    const forms = new Map(formsResult.result.map((f) => [f.name, f]));
    const schema = parseResult.result;
    const createPageForm = this.getPageFormCreator(schema, forms);
    const createUrl = this.getUrlCreator(schema);

    const result: Form[] = [];
    for (const path in schema.paths) {
      const formsByMethod: Record<string, Form> = {};
      for (const method in schema.paths[path]) {
        formsByMethod[method] = createPageForm(
          path,
          method,
          createUrl(path, method),
        );
      }
      result.push(...this.getMergedPageForms(formsByMethod));
    }
    result
      .sort((x, y) => compareUrls(x.name, y.name))
      .forEach((i) => (i.fields = [{ type: 'page', fieldGroup: i.fields }]));
    const names = result.map((i) => i.name);
    result.push(this.createAppForm(names));
    return {
      success: formsResult.success,
      message: formsResult.message,
      result: result,
    };
  }

  private getMergedPageForms(formsByMethod: Record<string, Form>): Form[] {
    const result: Form[] = [];
    if (
      formsByMethod['get'] &&
      (formsByMethod['put'] || formsByMethod['delete'])
    ) {
      const getForm = formsByMethod['get'];
      const putForm = formsByMethod['put'];
      const deleteForm = formsByMethod['delete'];
      const form = putForm ?? getForm;
      if (putForm) {
        putForm.fields = putForm?.fields.filter((i) => i.key !== 'result');
        putForm.fields
          .filter((i) => i.key === 'body')
          .forEach((i) => {
            i.key = 'result';
            i.hide = true;
            i.props ??= {};
            i.props.disabled = true;
          });
        putForm.fields
          .filter((i) => i.type === 'action')
          .forEach((i) => {
            i.key = 'result-buttons';
            i.type = 'save-action';
            i.props = {
              ...i.props,
              action: this.actionNames['save'],
              inputGroups:
                i.props?.inputGroups.map((j: any) =>
                  j === 'body' ? 'result' : j,
                ) ?? [],
            };
          });

        const getAction = getForm.fields.find((i) => i.type === 'load-action');
        getAction && form.fields.unshift(getAction);
        form.name = getForm.name;
      }
      if (deleteForm) {
        const action = deleteForm.fields.find((i) => i.type === 'action');
        if (action) {
          action.key = 'result-buttons';
          action.props = {
            ...action?.props,
            action: this.actionNames['send-and-close'],
          };
          form.fields.push(action);
        }
      }
      result.push(form);
    }
    const skipMethodSet = new Set(
      result.length ? ['get', 'put', 'delete'] : [],
    );
    for (const method in formsByMethod) {
      if (!skipMethodSet.has(method)) {
        result.push(formsByMethod[method]);
      }
    }
    return result;
  }

  private getPageFormCreator(
    schema: any,
    forms: Map<string, Form>,
  ): (path: string, method: string, pageUrl: string) => Form {
    return (path: string, method: string, pageUrl: string) => {
      const formName = `${path}.${method}`.replace(/^\//, '');
      const fields: FormlyFieldConfig[] = [];
      const inputGroups: string[] = [];
      const pathParameterForm = forms.get(`${formName}-path`);
      if (pathParameterForm) {
        fields.push(this.createPageGroup('path', pathParameterForm.fields));
        inputGroups.push('path');
      }
      const parameterForm = forms.get(`${formName}-query`);
      if (parameterForm) {
        fields.push(this.createPageGroup('query', parameterForm.fields));
        inputGroups.push('query');
      }
      const form = forms.get(formName);
      if (form) {
        fields.push(this.createPageGroup('body', form.fields));
        inputGroups.push('body');
      }
      const resultForm = forms.get(`${formName}-result`);
      const label = this.actionLabels[method] ?? method;
      const action: FormlyFieldConfig = {
        key: 'buttons',
        type: 'action',
        props: {
          label: label,
          url: path,
          method: method,
          inputGroups: inputGroups,
          action: this.actions[method],
        },
      };
      if (action.props?.method === 'get') {
        action.type = 'load-action';
        if (inputGroups.every((i) => i === 'path' || i === 'query')) {
          action.props.autoRun = true;
        }
        !resultForm &&
          (action.props.action = this.actionNames['send-and-show-message']);
      }
      const responses = schema.paths[path][method].responses;
      let contentTypes: any = {};
      if (responses) {
        if (responses['200'] && responses['200']['content']) {
          contentTypes = responses['200']['content'];
        } else if (responses['201'] && responses['201']['content']) {
          contentTypes = responses['201']['content'];
        }
      }
      if (action.props) {
        for (let i = 0, l = this.contentTypeOrder.length; i < l; i++) {
          const contentType = this.contentTypeOrder[i];
          if (contentTypes[contentType]) {
            action.props.responseType = this.responseTypes[contentType];
            break;
          }
        }
      }
      fields.push(action);
      if (resultForm) {
        const resultFields = this.createPageGroup('result', resultForm.fields);
        resultFields.hide = true;
        resultFields.props ??= {};
        resultFields.props.disabled = true;
        fields.push(resultFields);
      }
      return { name: pageUrl.replace(/^\//, ''), fields: fields };
    };
  }

  private getUrlCreator(schema: any): (path: string, method: string) => string {
    return (path: string, method: string) => {
      if (method === 'get') {
        return path;
      }
      const nMethods = Object.keys(schema.paths[path]).length;
      if (nMethods === 1) {
        return path;
      }
      let pageUrl = path.endsWith('}')
        ? `${path}/${this.urlSuffixes[method] ?? method}`
        : `${path}/${this.urlSuffixes[method] ?? method}`;
      if (schema.paths[pageUrl]) {
        let i = 1;
        while (schema.paths[`${pageUrl}${++i}`]);
        pageUrl = `${pageUrl}${i}`;
      }
      return pageUrl;
    };
  }

  private createAppForm(names: string[]): Form {
    return {
      name: FORMLY_APP_FORM_NAME,
      fields: generateApp(names),
    };
  }

  private createPageGroup(
    key: string,
    fields: FormlyFieldConfig[],
  ): FormlyFieldConfig {
    if (fields.length === 1 && !fields[0].key) {
      fields[0].key = key;
      return fields[0];
    }
    return {
      type: 'object',
      key: key,
      fieldGroup: fields,
    };
  }
}
