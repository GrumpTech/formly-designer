import { IConverter } from '../models';

export class DateTimeConverter implements IConverter {
  get type(): string {
    return 'datetimepicker';
  }

  convertInput(value: any): any {
    return typeof value === 'string'
      ? new Date(`${value.replace('T', ' ')} UTC`)
      : value;
  }

  convertOutput(value: any): any {
    return value instanceof Date ? value.toISOString() : value;
  }
}
