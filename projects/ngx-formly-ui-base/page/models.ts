import { FormlyFieldProps } from '@ngx-formly/core';
import { ConverterService } from './converter-service';

export interface PageProps extends FormlyFieldProps {
  navigationDisabled?: boolean;
  converterService?: ConverterService;
}
