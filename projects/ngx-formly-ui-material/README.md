# ngx-formly-ui-material

A collection of components extending `@ngx-formly/material` and `@grumptech/ngx-formly-ui-base`, designed for building frontend applications.

## Getting started

### Install

Run `npm i @grumptech/ngx-formly-ui-material`.

### Configure

Configure Formly with the Formly Material components and configuration:

```typescript
provideFormlyCore(withFormlyUiMaterial());
```

Or add the Formly Material components and configuration to an existing Formly configuration:

```typescript
provideFormlyConfig(withFormlyUiMaterial());
```

Then call `provideFormlyAppConfig` to configure the base components. See [ngx-formly-ui-base](/projects/ngx-formly-ui-base/README.md) for more information.

### Develop

- Run `npm install` to install the necessary npm packages.
- Run `npm run build` to build the library.
