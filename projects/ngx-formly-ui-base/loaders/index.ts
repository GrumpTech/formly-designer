import { Provider, Type } from '@angular/core';
import { IFormsLoader } from './models';

export * from './app-loader.component';
export * from './app-and-forms-loader.component';
export * from './form-loader.component';
export * from './forms-loader.component';
export * from './page-loader.component';
export * from './services/empty-form-loader';
export * from './models';

export function provideFormsLoader(formsLoader: Type<IFormsLoader>): Provider {
  return [
    {
      provide: IFormsLoader,
      useClass: formsLoader,
    },
  ];
}
