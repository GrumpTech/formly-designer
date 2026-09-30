import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import {
  Form,
  jsonParse,
  Result,
  toFlatArray,
  toFailedArrayResult,
} from '@grumptech/formly-converters';
import { IFormsImporter } from '../models';

@Injectable({ providedIn: 'root' })
export class JsonSchemaImporter implements IFormsImporter {
  private formlyJsonschema = inject(FormlyJsonschema);

  get name() {
    return 'Json schema';
  }
  get hasMultipleFileSelection() {
    return true;
  }
  get extensions() {
    return ['json'];
  }

  async import(data: string, filename: string): Promise<Result<Form[]>> {
    const parseResult = jsonParse(data);
    if (!parseResult.success) {
      return toFailedArrayResult(parseResult.message);
    }
    return this.importJsonSchema(parseResult.result, filename);
  }

  importJsonSchema(schema: any, filename: string): Result<Form[]> {
    const fields: FormlyFieldConfig[] = [];
    try {
      fields.push(
        this.formlyJsonschema.toFieldConfig(schema, {
          map: (field, fieldSchema) => this.map(field, fieldSchema),
        }),
      );
    } catch (error) {
      return toFailedArrayResult(
        `Invalid json schema - ${(error as any).message}`,
      );
    }
    toFlatArray(fields).forEach((field) => this.modifyAfterCalculation(field));
    return {
      success: true,
      message: '',
      result: [{ name: filename, fields }],
    };
  }

  protected map(field: FormlyFieldConfig, fieldSchema: any): FormlyFieldConfig {
    return field;
  }

  protected modifyAfterCalculation(field: FormlyFieldConfig): void {}
}
