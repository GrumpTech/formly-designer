import { FormlyFieldConfig } from '@ngx-formly/core';
import { validateArray } from '@grumptech/formly-field-validator';
import { ErrorObject } from 'ajv';
import JSON5 from 'json5';
import { Result } from './models';
import { toFailedArrayResult } from './result-methods';

export function jsonParse(data: string): Result<any> {
  try {
    return {
      success: true,
      message: '',
      result: JSON5.parse(data ?? ''),
    };
  } catch (error) {
    return {
      success: false,
      message: `Invalid json - ${(error as any).message}`,
      result: {},
    };
  }
}

export function jsonParseFields(data: string): Result<FormlyFieldConfig[]> {
  const result = jsonParse(data);
  result.result = Array.isArray(result.result)
    ? result.result
    : [result.result];
  return result;
}

export function jsonParseFieldsAndValidate(
  data: string,
): Result<FormlyFieldConfig[]> {
  const parseResult = jsonParseFields(data);
  if (!parseResult.success) {
    return toFailedArrayResult(parseResult.message);
  }
  const validationResult = validateArray(parseResult.result);
  if (!validationResult.valid) {
    const message = validationResult.errors
      .map((i) => createErrorMessage(i))
      .join('\n');
    return toFailedArrayResult(`Unexpected data type: ${message}`);
  }
  return parseResult;
}

function createErrorMessage(
  error: ErrorObject<string, Record<string, any>>,
): string {
  if (error.keyword === 'additionalProperties') {
    return (
      `${error.instancePath || '/'}${error.params.additionalProperty} - ` +
      `path ${error.instancePath || '/'} ${error.message}`
    );
  }
  return `path ${error.instancePath || '/'} ${error.message}`;
}
