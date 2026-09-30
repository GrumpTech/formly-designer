import { Injectable } from '@angular/core';
import { jsonStringify } from '@grumptech/formly-converters';
import { IExporter } from '@grumptech/ngx-matx/editor-app';

@Injectable({ providedIn: 'root' })
export class JsonExporter<T> implements IExporter<T> {
  get name() {
    return 'Json';
  }
  get extension() {
    return '.json';
  }

  export(data: T): string {
    return jsonStringify(data);
  }
}
