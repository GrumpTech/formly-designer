import { Injectable } from '@angular/core';
import {
  Form,
  jsonParseFieldsAndValidate,
  Result,
  toFailedArrayResult,
} from '@grumptech/formly-converters';
import { IFormsImporter } from '../models';

@Injectable({ providedIn: 'root' })
export class JsonImporter implements IFormsImporter {
  get name() {
    return 'Json';
  }
  get hasMultipleFileSelection() {
    return true;
  }
  get extensions() {
    return ['json'];
  }

  async import(data: string, filename: string): Promise<Result<Form[]>> {
    const parseResult = jsonParseFieldsAndValidate(data);
    if (!parseResult.success) {
      return toFailedArrayResult(parseResult.message);
    }
    return {
      success: true,
      message: '',
      result: [
        {
          name: filename,
          fields: parseResult.result,
        },
      ],
    };
  }
}
