import { IConverter } from '../models';

export class DateConverter implements IConverter {
  get type(): string {
    return 'datepicker';
  }

  convertInput(value: any): any {
    return value.length >= 10
      ? new Date(
          parseInt(value.substring(0, 4)),
          parseInt(value.substring(5, 7)) - 1,
          parseInt(value.substring(8, 10)),
        )
      : value;
  }

  convertOutput(value: any): any {
    return value instanceof Date
      ? `${value.getFullYear()}-` +
          `${value.getMonth() + 1}`.padStart(2, '0') +
          `-${`${value.getDate()}`.padStart(2, '0')}`
      : value;
  }
}
