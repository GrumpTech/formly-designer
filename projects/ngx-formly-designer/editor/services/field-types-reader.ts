import {
  FieldArrayType,
  FormlyConfig,
  FormlyFieldConfig,
} from '@ngx-formly/core';
import { Injectable, inject } from '@angular/core';
import { EditorConfigReader } from './editor-config-reader';

@Injectable()
export class FieldTypesReader {
  private formlyConfig = inject(FormlyConfig);
  private groupTypes = inject(EditorConfigReader).groupTypes;
  private initialized = false;
  private fieldTypes: readonly string[] = [];
  private fieldTypesSet = new Set<string>();
  private fieldArrayTypesSet = new Set<string>();
  private fieldGroupTypesSet = new Set<string>();

  private initialize() {
    if (this.initialized) {
      return;
    }
    const fieldTypes = this.formlyConfig.types;
    this.fieldTypes = Object.freeze(
      Object.keys(fieldTypes)
        .filter((i) => !i.startsWith('formly-editor-'))
        .sort((x, y) => x.localeCompare(y)),
    );
    this.fieldTypesSet = new Set(this.fieldTypes);
    this.fieldGroupTypesSet = new Set(this.groupTypes);
    this.fieldArrayTypesSet = new Set(
      this.fieldTypes.filter(
        (i) => fieldTypes[i].component?.prototype instanceof FieldArrayType,
      ),
    );
    this.initialized = true;
  }

  get(): readonly string[] {
    this.initialize();
    return this.fieldTypes;
  }

  getType(field: FormlyFieldConfig): string {
    this.initialize();
    if (typeof field.type === 'string') {
      return field.type;
    }
    return field.template ? 'formly-template' : 'formly-group';
  }

  getStandardTypes(): readonly string[] {
    this.initialize();
    return this.fieldTypes.filter(
      (i) =>
        i !== 'formly-template' &&
        !this.fieldGroupTypesSet.has(i) &&
        !this.fieldArrayTypesSet.has(i),
    );
  }

  getGroupTypes(): readonly string[] {
    this.initialize();
    return this.fieldTypes.filter((i) => this.fieldGroupTypesSet.has(i));
  }

  getArrayTypes(): readonly string[] {
    this.initialize();
    return this.fieldTypes.filter((i) => this.fieldArrayTypesSet.has(i));
  }

  hasExistingType(field: FormlyFieldConfig): boolean {
    this.initialize();
    return (
      !('type' in field) ||
      (typeof field.type === 'string' && this.fieldTypesSet.has(field.type))
    );
  }

  isFieldGroup(field: FormlyFieldConfig): boolean {
    this.initialize();
    return this.fieldGroupTypesSet.has(this.getType(field));
  }

  isFieldArray(field: FormlyFieldConfig): boolean {
    this.initialize();
    return (
      typeof field.type === 'string' && this.fieldArrayTypesSet.has(field.type)
    );
  }
}
