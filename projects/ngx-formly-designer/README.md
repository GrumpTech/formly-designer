# ngx-formly-designer

Formly Designer is a visual editor for creating [Formly](https://formly.dev/) forms without manually writing their configuration.

Instead of writing form configurations manually in code, users can:

- Add and arrange form fields visually.
- Configure field properties and component behavior.
- Import form definitions from JSON schema's or OpenApi.
- Generate a frontend based on an OpenApi definition.
- Preview and test the resulting forms.

The designer generates a Formly field configuration that can be used by an Angular application to render forms or frontend pages.

## Getting started

### Install

Run `npm i @grumptech/ngx-formly-designer`.

### Configure

First, register the components for both the application and the Formly Designer:

```typescript
provideFormlyCore(withFormlyUiMaterial(), withFormlyEditorTypes());
```

Next, configure the Formly application using provideFormlyAppConfig, as described in the [ngx-formly-ui-base README](/projects/ngx-formly-ui-base/README.md).

**Note:** The form loader will be provided by Formly designer.

```typescript
provideFormlyAppConfig({
  baseUrl: apiPath,
  messageService: MaterialMessageService,
});
```

Register the Formly Designer using provideFormlyDesigner:

```typescript
provideFormlyDesigner({
  fileServiceUrl: '/file-service',
  importers: [
    JsonImporter,
    ExtendedJsonSchemaImporter,
    ExtendedOpenApiImporter,
    ExtendedOpenApiAppImporter,
  ],
  editor: {
    formRenderConfig: {
      editFormFieldConverter: (field: FormlyFieldConfig) => {
        field.hide && delete field.hide;
        field.expressions && delete field.expressions;
        field.props?.url && delete field.props.url;
        field.props?.autoRun && delete field.props.autoRun;
      },
      testFormFieldConverter: (field: FormlyFieldConfig) => {
        field.type === 'page' &&
          (field.props ??= {}) &&
          (field.props.navigationDisabled = true);
      },
    }
  },
}),
```

The fileServiceUrl specifies the endpoint used by the Designer's file service. The importers array registers the supported form importers. The formRenderConfig allows the form configuration to be adjusted when rendering forms in edit or test mode. In this example:

- with editFormFieldConverter runtime-only properties such as hide, expressions, props.url, and props.autoRun are removed.
- with testFormFieldConverter page navigation is disabled while testing a form.

Finally, add the Formly Designer to the application's routes:

```typescript
    {
      path: 'designer',
      loadComponent: () =>
        import('@grumptech/ngx-formly-designer').then(
          (m) => m.FormlyDesigner,
        ),
    }
```

The designer will then be available at `/designer`.

### Develop

- Run `npm install` to install the necessary npm packages.
- Run `npm run build` to build the library.
