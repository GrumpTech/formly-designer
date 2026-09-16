import { Injectable, inject } from '@angular/core';
import { openapiSchemaToJsonSchema } from '@openapi-contrib/openapi-schema-to-json-schema';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { Buffer } from 'buffer';
import {
  Form,
  jsonParse,
  Result,
  toFailedArrayResult,
} from '@grumptech/formly-converters';
import { IFormsImporter } from '../models';
import { JsonSchemaImporter } from './json-schema-importer';

interface FormSchema {
  path: string;
  method: string;
  group: 'path' | 'query' | 'body' | 'result';
  schema: any;
}

@Injectable({ providedIn: 'root' })
export class OpenApiImporter implements IFormsImporter {
  protected jsonSchemaImporter = inject(JsonSchemaImporter);

  get name() {
    return 'OpenApi 3.0';
  }
  get hasMultipleFileSelection() {
    return false;
  }
  get extensions() {
    return ['json'];
  }

  async import(data: string, _filename: string): Promise<Result<Form[]>> {
    const parseResult = jsonParse(data);
    if (!parseResult.success) {
      return toFailedArrayResult(parseResult.message);
    }
    let schema = parseResult.result;
    if (!(schema?.openapi ?? '').startsWith('3.0')) {
      return toFailedArrayResult('Expected OpenAPI version 3.0');
    }
    window.Buffer ??= Buffer;
    try {
      await $RefParser.dereference(schema);
    } catch (error) {
      return toFailedArrayResult(
        `Open api schema could not be dereferenced - ${(error as any).message}`,
      );
    }
    try {
      schema = openapiSchemaToJsonSchema(schema);
    } catch (error) {
      return toFailedArrayResult(
        `Open api schema could not be converted to JSON schema format - ${
          (error as any).message
        }`,
      );
    }

    const formsResult = this.schemaToForms(schema);
    formsResult.result = this.modifyResult(formsResult.result, schema);
    return formsResult;
  }

  protected modifyResult(forms: Form[], schema: any): Form[] {
    return forms;
  }

  private schemaToForms(schema: any): Result<Form[]> {
    const formSchemas: FormSchema[] = [];
    for (const path in schema.paths) {
      for (const method in schema.paths[path]) {
        const formSchema =
          schema.paths[path][method]?.requestBody?.content['application/json']
            ?.schema;
        if (formSchema) {
          formSchemas.push({
            path: path,
            method: method,
            group: 'body',
            schema: formSchema,
          });
        }
        const parameters = schema.paths[path][method]?.parameters;
        const pathSchema = parameters
          ? this.openApi3ParametersToJsonSchema(parameters, 'path')
          : null;
        if (pathSchema) {
          formSchemas.push({
            path: path,
            method: method,
            group: 'path',
            schema: pathSchema,
          });
        }
        const querySchema = parameters
          ? this.openApi3ParametersToJsonSchema(parameters, 'query')
          : null;
        if (querySchema) {
          formSchemas.push({
            path: path,
            method: method,
            group: 'query',
            schema: querySchema,
          });
        }
        const content = schema.paths[path][method]?.responses['200']?.content;
        const resultFormSchema = content
          ? content['application/json']?.schema
          : null;
        if (resultFormSchema) {
          formSchemas.push({
            path: path,
            method: method,
            group: 'result',
            schema: resultFormSchema,
          });
        }
      }
    }
    const result = this.toFormsImportResult(formSchemas);
    result.result.sort((x, y) => x.name.localeCompare(y.name));
    return result;
  }

  private openApi3ParametersToJsonSchema(
    parameters: any,
    parameterType: string,
  ): any {
    const result: {
      additionalProperties: boolean;
      properties: any;
      required: any[];
      type: string;
    } = {
      additionalProperties: false,
      properties: {},
      required: [],
      type: 'object',
    };
    for (let i = 0, l = parameters.length; i < l; i++) {
      const parameter = parameters[i];
      if (parameter.in === parameterType) {
        if (parameterType === 'path') {
          result.required.push(parameter.name);
        }
        result.properties[parameter.name] = parameter.schema;
      }
    }
    return Object.keys(result.properties).length ? result : null;
  }

  private toFormsImportResult(schemas: FormSchema[]): Result<Form[]> {
    const forms: Form[] = [];
    const messages: string[] = [];
    for (let i = 0, l = schemas.length; i < l; i++) {
      const path = schemas[i].path;
      const method = schemas[i].method;
      const group = schemas[i].group;
      const name =
        `${path}.${method}${group === 'body' ? '' : `-${group}`}`.replace(
          /^\//,
          '',
        );
      const formsResult = this.jsonSchemaImporter.importJsonSchema(
        schemas[i].schema,
        name,
      );
      if (!formsResult.success) {
        messages.push(`${name} - ${formsResult.message}`);
      }
      const fields = formsResult.result[0].fields;
      if (
        fields.length &&
        (fields[0].type !== 'object' || fields[0].fieldGroup?.length)
      ) {
        forms.push({
          name: name,
          fields: fields,
        });
      }
    }
    return {
      success: messages.length === 0,
      message: messages.join('\n'),
      result: forms,
    };
  }
}
