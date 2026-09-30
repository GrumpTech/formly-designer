import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  Form,
  keyToLabel,
  toFlatArray,
  getLinkPaths,
  getArrayServices,
  ArrayService,
} from '@grumptech/formly-converters';
import { ExtendedJsonSchemaImporter } from './extended-json-schema-importer';
import { OpenApiImporter } from './open-api-importer';

@Injectable({ providedIn: 'root' })
export class ExtendedOpenApiImporter extends OpenApiImporter {
  protected jsonSchemaImporter = inject(ExtendedJsonSchemaImporter);

  protected modifyResult(forms: Form[], schema: any): Form[] {
    const linkPathSet = new Set(
      getLinkPaths(schema).map((i) => i.replace(/^\//, '').toLowerCase()),
    );
    const arrayServicesByReference = this.getArrayServicesByReference(schema);
    forms.forEach((i) => {
      const posPathEnd = i.name.lastIndexOf('.');
      let posMethodEnd = i.name.indexOf('-', posPathEnd);
      posMethodEnd = posMethodEnd === -1 ? i.name.length : posMethodEnd;
      const path = i.name.substring(0, posPathEnd);
      const method = i.name.substring(posPathEnd + 1, posMethodEnd);

      this.createLink(i.fields, path, linkPathSet);
      toFlatArray(i.fields).forEach((j) => {
        this.createUrlSelect(j, arrayServicesByReference);
        if (j.type === 'array' || j.type === 'grid') {
          if (method === 'get') {
            j.props ??= {};
            j.props.readonly = true;
          }
          if (j.props?.emptyArrayMessage) {
            j.props.emptyArrayMessage += method === 'get' ? ' found' : ' yet';
          }
        }
      });
    });
    return forms;
  }

  private createLink(
    fields: FormlyFieldConfig[],
    path: string,
    paths: Set<string>,
  ): void {
    if (
      path.endsWith('}') ||
      fields.length !== 1 ||
      typeof fields[0].fieldArray !== 'object'
    ) {
      return;
    }
    const field = fields[0].fieldArray?.fieldGroup?.find(
      (i) =>
        (i.type === 'integer' || i.type === 'string') &&
        paths.has(`${path}/{${i.key}}`.toLowerCase()),
    );
    if (field) {
      field.type = 'link';
      field.props ??= {};
      field.props.url = `${path}/{${field.key}}`;
    }
  }

  private getArrayServicesByReference(
    schema: any,
  ): Record<string, ArrayService> {
    const arrayServices = getArrayServices(schema);
    const result: Record<string, ArrayService> = {};
    const regExp = new RegExp('[^/]*$');
    arrayServices.forEach((s) => {
      const match = s.url.match(regExp);
      const reference = match
        ? match[0]
            .replace(/ies$/, 'y')
            .replace(/s$/, '')
            .concat(s.valueKey)
            .toLowerCase()
        : undefined;
      if (
        reference &&
        (!result[reference] || s.url.length < result[reference].url.length)
      ) {
        result[reference] = s;
      }
    });
    return result;
  }

  private createUrlSelect(
    field: FormlyFieldConfig,
    arrayServicesByReference: Record<string, ArrayService>,
  ) {
    if (typeof field.key === 'string' && field.key.length > 2) {
      const arrayService = arrayServicesByReference[field.key.toLowerCase()];
      if (arrayService) {
        field.type = 'url-select';
        field.props ??= {};
        if (
          field.key
            ?.toLowerCase()
            ?.endsWith(arrayService.valueKey.toLowerCase())
        ) {
          field.props.label = keyToLabel(
            field.key.slice(0, -arrayService.valueKey.length),
          );
        }
        field.props.url = arrayService.url;
        field.props.valueKey = arrayService.valueKey;
        field.props.labelKey = arrayService.labelKey;
      }
    }
  }
}
