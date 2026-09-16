import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IConverter } from '../models';
import { FORMLY_APP_CONVERTERS } from '../config';

@Injectable()
export class ConverterService {
  private converters = inject(FORMLY_APP_CONVERTERS, { optional: true }) ?? [];
  private convertersByType: Map<string, IConverter>;

  constructor() {
    this.convertersByType = new Map(this.converters.map((i) => [i.type, i]));
  }

  convertInput(data: any, fields: FormlyFieldConfig[]): void {
    this.convert(data, fields, 'input');
  }

  convertOutput(data: any, fields: FormlyFieldConfig[]): void {
    this.convert(data, fields, 'output');
  }

  private convert(
    data: any,
    fields: FormlyFieldConfig[],
    method: 'input' | 'output',
  ): void {
    if (!data || typeof data !== 'object') {
      return;
    }
    for (const field of fields) {
      if (!field.key) {
        field.fieldGroup && this.convert(data, field.fieldGroup, method);
        continue;
      }
      const key = `${field.key}`;
      if (!(key in data)) {
        continue;
      }
      if (field.fieldGroup) {
        this.convert(data[key], field.fieldGroup, method);
      }
      if (
        field.fieldArray &&
        typeof field.fieldArray === 'object' &&
        Array.isArray(data[key])
      ) {
        if (field.fieldArray.fieldGroup) {
          for (const item of data[key]) {
            this.convert(item, field.fieldArray.fieldGroup, method);
          }
        } else {
          const converter =
            typeof field.fieldArray.type === 'string' &&
            this.convertersByType.get(field.fieldArray.type);
          if (!converter) {
            continue;
          }
          for (let i = 0, l = data[key].length; i < l; i++) {
            data[key][i] = this.convertField(data[key][i], converter, method);
          }
        }
      } else {
        const converter =
          typeof field.type === 'string' &&
          this.convertersByType.get(field.type);
        if (!converter) {
          continue;
        }
        data[key] = this.convertField(data[key], converter, method);
      }
    }
  }

  private convertField(
    data: any,
    converter: IConverter,
    method: 'input' | 'output',
  ) {
    return method === 'input'
      ? converter.convertInput(data)
      : converter.convertOutput(data);
  }
}
