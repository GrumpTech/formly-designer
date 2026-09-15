# ngx-formly-ui-prime-ng

A collection of components extending `primeng` and `@grumptech/ngx-formly-ui-base`, designed for building frontend applications.

## Getting started

### Install

Run `npm i @grumptech/ngx-formly-ui-prime-ng`.

### Configure

Configure Formly with the Formly PrimeNG components and configuration:

```typescript
provideFormlyCore(withFormlyUiPrimeNg());
```

Or add the Formly PrimeNG components and configuration to an existing Formly configuration:

```typescript
provideFormlyConfig(withFormlyUiPrimeNg());
```

Then call `provideFormlyAppConfig` to configure the base components. See [ngx-formly-ui-base](/projects/ngx-formly-ui-base/README.md) for more information.

### Develop

- Run `npm install` to install the necessary npm packages.
- Run `npm run build` to build the library.
