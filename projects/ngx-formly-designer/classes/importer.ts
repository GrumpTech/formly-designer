import { FormlyFieldConfig } from '@ngx-formly/core';
import { IFormsImporter } from '@grumptech/ngx-formly-importers';
import { IImporter, NameAndData, Result } from '@grumptech/ngx-matx/editor-app';

export class Importer implements IImporter<FormlyFieldConfig[]> {
  constructor(private formImporter: IFormsImporter) {}

  get name(): string {
    return this.formImporter.name;
  }
  get hasMultipleFileSelection(): boolean {
    return this.formImporter.hasMultipleFileSelection;
  }
  get extensions(): string[] {
    return this.formImporter.extensions;
  }

  async import(
    data: string,
    filename: string,
  ): Promise<Result<NameAndData<FormlyFieldConfig[]>[]>> {
    const result = await this.formImporter.import(data, filename);
    return {
      success: result.success,
      message: result.message,
      result: result.result.map((i) => ({ name: i.name, data: i.fields })),
    };
  }
}
