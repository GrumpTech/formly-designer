# ngx-formly-ui-editor

A collection of components designed for use in the designer and editor of `@grumptech/formly-designer` and `@grumptech/formly-editor`.

## Getting started

### Install

Run `npm i @grumptech/ngx-formly-ui-prime-ng`.

### Configure

Configure Formly with editor components and configuration:

```typescript
provideFormlyCore(withFormlyEditorTypes());
```

Or add the editor components and configuration to an existing Formly configuration:

```typescript
provideFormlyConfig(withFormlyEditorTypes());
```

### Develop

- Run `npm install` to install the necessary npm packages.
- Run `npm run build` to build the library.
