import { Provider, inject } from '@angular/core';
import {
  ConfigOption,
  FORMLY_CONFIG,
  FormlyConfig,
  provideFormlyCore,
} from '@ngx-formly/core';

export const provideFormlyCoreScoped = (
  configs: ConfigOption[] | ConfigOption = [],
): Provider => {
  const core = provideFormlyCore([]);
  if (Array.isArray(core) && core.length > 1) {
    return [FormlyConfig, core[0], provideFormlyConfigScoped(configs)];
  }
  throw 'The implementation of provideFormlyCore has changed. The provideFormlyCoreScoped function must be reimplemented.';
};

export const provideFormlyConfigScoped = (
  configs: ConfigOption[] | ConfigOption,
): Provider => {
  return {
    provide: FORMLY_CONFIG,
    multi: true,
    useFactory: () => {
      const currentConfig = inject(FORMLY_CONFIG, {
        skipSelf: true,
        optional: true,
      });
      if (
        currentConfig &&
        inject(FormlyConfig) ===
          inject(FormlyConfig, { skipSelf: true, optional: true })
      ) {
        configs = Array.isArray(configs) ? configs : [configs];
        currentConfig.push(...configs);
        return currentConfig;
      }
      return configs;
    },
  };
};
