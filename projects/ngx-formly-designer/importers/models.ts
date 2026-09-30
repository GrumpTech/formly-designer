import { Form, Result } from '@grumptech/formly-converters';

export abstract class IFormsImporter {
  abstract get name(): string;
  abstract get hasMultipleFileSelection(): boolean;
  abstract get extensions(): string[];

  abstract import: (data: string, filename: string) => Promise<Result<Form[]>>;
}
