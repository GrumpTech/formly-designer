import { InjectionToken, Type } from '@angular/core';
import { IConverter } from '@grumptech/ngx-formly-ui-base/defs';
import { DateConverter } from './converters/date-converter';
import { DateTimeConverter } from './converters/datetime-converter';

export const FORMLY_APP_CONVERTERS = new InjectionToken<IConverter[]>(
  'formlyAppConverters',
);

export { DateConverter, DateTimeConverter };

export const defaultConverters: Type<IConverter>[] = [
  DateConverter,
  DateTimeConverter,
];
