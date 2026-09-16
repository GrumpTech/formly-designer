import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { keyToLabel } from '@grumptech/formly-converters';
import { IFormsImporter } from '../models';
import { JsonSchemaImporter } from './json-schema-importer';

@Injectable({ providedIn: 'root' })
export class ExtendedJsonSchemaImporter
  extends JsonSchemaImporter
  implements IFormsImporter
{
  protected override map(
    field: FormlyFieldConfig,
    fieldSchema: any,
  ): FormlyFieldConfig {
    field.props ??= {};

    // set field type to datepicker for dates and datetimes
    if (field.type === 'string') {
      if (fieldSchema.format === 'date') {
        field.type = 'datepicker';
      } else if (fieldSchema.format === 'date-time') {
        field.type = 'datetimepicker';
      }
    }

    // set required to true if field is not nullable
    if (!fieldSchema.nullable) {
      field.props.required = true;
    }

    // replace field array function with value
    if (typeof field.fieldArray === 'function') {
      field.fieldArray = field.fieldArray(field);
    }

    // set label if empty
    if (field.key && !field.props?.label) {
      field.props.label = keyToLabel(field.key?.toString() ?? '');
    }

    // fields in readonly objects / arrays don't have to be readonly (dotnet)
    if (field.props?.disabled && !field.props?.readonly) {
      delete field.props.disabled;
    }

    // set array defaults
    if (field.type === 'array') {
      if (field.props?.readonly) {
        // readonly is default for arrays scaffolded database (dotnet)
        delete field.props.readonly;
        field.props?.disabled && delete field.props.disabled;
      }
      let label = field.props?.label;
      const addButtonLabel = label?.length
        ? `Add ${label.toLowerCase()}`
        : 'Add';
      label ??= 'items';
      field.props = {
        ...field.props,
        emptyArrayMessage: `No ${label[0].toLowerCase() + label.slice(1)}`,
        addButtonLabel: addButtonLabel.replace(/ies$/, 'y').replace(/s$/, ''),
      };
      if (
        typeof field.fieldArray === 'object' &&
        (!field.fieldArray.fieldGroup ||
          (field.fieldArray.fieldGroup.length <= 8 &&
            !field.fieldArray.fieldGroup.some(
              (i) =>
                i.type === 'object' || i.type === 'array' || i.type === 'grid',
            )))
      ) {
        field.type = 'grid';
      }
    }

    return field;
  }

  protected override modifyAfterCalculation(
    field: FormlyFieldConfig,
  ): FormlyFieldConfig {
    // set fields with min length, min, or max to required
    if (field.props?.minLength || field.props?.min || field.props?.max) {
      field.props.required = true;
    }

    // set fields with expression for required to required, remove the expression
    if (field.expressions && field.expressions['props.required']) {
      field.props = field.props ?? {};
      field.props.required = true;
      delete field.expressions['props.required'];
    }
    return field;
  }
}
