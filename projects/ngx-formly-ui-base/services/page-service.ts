import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PageProps } from '../models';

@Injectable({ providedIn: 'root' })
export class PageService {
  initialize(field: FormlyFieldConfig<PageProps>): void {
    if (!this.isNavigationEnabled(field)) {
      if (
        field.fieldGroup?.some(
          (i) => i.hide && (i.key === 'path' || i.key === 'query'),
        )
      ) {
        console.warn(
          'Due to the combination of navigationDisabled and hidden path and/or query parameters, ' +
            'these values could not be populated. The path and/or query variables are therefore shown.',
        );
        this.toggleVisible(field, ['path', 'query'], true);
      }
    }
  }

  isValid(field: FormlyFieldConfig<PageProps>, groups: string[]): boolean {
    const form = field.form;
    return groups.every((i) => {
      if (
        (i === 'path' || i === 'query') &&
        (this.isHidden(field, [i]) || !this.isEnabled(field, [i]))
      ) {
        return true;
      } else {
        return form?.get(i)?.valid;
      }
    });
  }

  validate(field: FormlyFieldConfig<PageProps>, groups: string[]): boolean {
    const form = field.form;
    groups.forEach((i) => form?.get(i)?.markAllAsTouched());
    const result = this.isValid(field, groups);
    !result && this.focusFirstInvalidField(field, groups);
    return result;
  }

  setData(
    field: FormlyFieldConfig<PageProps>,
    groups: string[],
    data: any,
  ): void {
    data = this.removeNullsRecursive(data);
    field.props?.converterService?.convertInput(data, field.fieldGroup ?? []);
    const model = field.model;
    groups.forEach((i) => {
      if (data[i]) {
        model[i] = data[i];
      } else {
        delete model[i];
      }
    });
    this.resetModel(field, field.model);
  }

  getData(field: FormlyFieldConfig<PageProps>, groups: string[]): any {
    if (!field.model) {
      return {};
    }
    const data: any = {};
    const model = field.model;
    groups.forEach((i) => {
      model[i] && (data[i] = structuredClone(model[i]));
    });
    field.props?.converterService?.convertOutput(data, field.fieldGroup ?? []);
    return data;
  }

  clearData(field: FormlyFieldConfig<PageProps>, groups: string[]): void {
    const value = field.model;
    groups.forEach((i) => delete value[i]);
    this.resetModel(field, value);
  }

  toggleVisible(
    field: FormlyFieldConfig<PageProps>,
    groups: string[],
    visible: boolean,
  ) {
    groups.forEach((i) =>
      field.fieldGroup
        ?.filter((j) => j.key === i)
        .forEach((j) => (j.hide = !visible)),
    );
  }

  isHidden(field: FormlyFieldConfig<PageProps>, groups: string[]): boolean {
    const fieldGroup = field.fieldGroup;
    return (
      !fieldGroup ||
      groups.every((i) =>
        fieldGroup.filter((j) => j.key === i).every((j) => j.hide),
      )
    );
  }

  toggleEnabled(
    field: FormlyFieldConfig<PageProps>,
    groups: string[],
    editable: boolean,
  ): void {
    const form = field.form;
    groups.forEach((i) => {
      editable ? form?.get(i)?.enable() : form?.get(i)?.disable();
      if (editable) {
        field.fieldGroup?.forEach((j) => {
          this.toFlatArrayRecursive(j).forEach(
            (k) => k.props?.readonly && k.formControl?.disable(),
          );
        });
      }
    });
  }

  isEnabled(field: FormlyFieldConfig<PageProps>, groups: string[]): boolean {
    const form = field.form;
    return groups.every((i) => form?.get(i)?.enabled);
  }

  isChanged(field: FormlyFieldConfig<PageProps>, groups: string[]): boolean {
    const form = field.form;
    return groups.some((i) => form?.get(i)?.dirty);
  }

  isNavigationEnabled(field: FormlyFieldConfig<PageProps>): boolean {
    return !field.props?.navigationDisabled;
  }

  toggleActionsEnabled(
    field: FormlyFieldConfig<PageProps>,
    enabled: boolean,
  ): void {
    field.fieldGroup?.forEach((i) => {
      if (`${i.type}`.endsWith('action')) {
        enabled && !i.props?.readonly
          ? i.formControl?.enable()
          : i.formControl?.disable();
      }
    });
  }

  toggleLoadActionEnabled(
    field: FormlyFieldConfig<PageProps>,
    enabled: boolean,
  ): void {
    field.fieldGroup?.forEach((i) => {
      if (`${i.type}` === 'load-action') {
        enabled && !i.props?.readonly
          ? i.formControl?.enable()
          : i.formControl?.disable();
      }
    });
  }

  reset(field: FormlyFieldConfig<PageProps>) {
    this.resetModel(field);
  }

  updateInitialValue(field: FormlyFieldConfig<PageProps>): void {
    const updateInitialValueFn = field.options?.updateInitialValue;
    if (!updateInitialValueFn) {
      throw new Error(
        'PageService needs access to FormlyFormOptions.updateInitialValue',
      );
    }
    updateInitialValueFn();
  }

  private resetModel(field: FormlyFieldConfig<PageProps>, model?: any) {
    const resetModelFn = field.options?.resetModel;
    if (!resetModelFn) {
      throw new Error(
        'PageService needs access to FormlyFormOptions.resetModel',
      );
    }
    resetModelFn(model);
  }

  private focusFirstInvalidField(
    field: FormlyFieldConfig<PageProps>,
    groups: string[],
  ): void {
    const groupFields =
      field.fieldGroup?.filter(
        (i) => i.key && groups.indexOf(`${i.key}`) !== -1,
      ) ?? [];
    const fields = this.toFlatArray(groupFields);
    for (let i = 0, l = fields.length; i < l; i++) {
      const field = fields[i];
      const element =
        field.formControl?.invalid &&
        field.id &&
        document.getElementById(field.id);
      if (element) {
        element.scrollIntoView &&
          element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        element.focus({ preventScroll: true });
        break;
      }
    }
  }

  private removeNullsRecursive(data: any): any {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        const result = [];
        for (let i = 0, l = data.length; i < l; i++) {
          result[i] = this.removeNullsRecursive(data[i]);
        }
        return result;
      } else {
        const result: any = {};
        for (const key in data) {
          if (data[key] !== null) {
            result[key] = this.removeNullsRecursive(data[key]);
          }
        }
        return result;
      }
    }
    return data;
  }

  private toFlatArray(
    fields: FormlyFieldConfig<PageProps>[],
  ): FormlyFieldConfig<PageProps>[] {
    const result: FormlyFieldConfig<PageProps>[] = [];
    fields.forEach((i) => result.push(...this.toFlatArrayRecursive(i)));
    return result;
  }

  private toFlatArrayRecursive(
    field: FormlyFieldConfig<PageProps>,
  ): FormlyFieldConfig<PageProps>[] {
    const result = [field];
    if (typeof field.fieldArray === 'object') {
      result.push(...this.toFlatArrayRecursive(field.fieldArray));
    }
    field.fieldGroup?.forEach((i) =>
      result.push(...this.toFlatArrayRecursive(i)),
    );
    return result;
  }
}
