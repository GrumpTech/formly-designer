# ngx-formly-designer

Formly Designer is a visual editor for creating [Formly](https://formly.dev/) forms without manually writing their configuration.

Instead of defining form configurations directly in code, you can

- Add and arrange form fields visually.
- Configure field properties and component behavior.
- Import form definitions from JSON schema's or OpenApi.
- Generate a frontend from an OpenAPI definition.
- Preview and test the resulting forms.

The designer generates a Formly field configuration that can be used by an Angular application to render forms or frontend pages.

## Getting started

### Install

Run `npm i @grumptech/ngx-formly-designer`.

### Configure designer

First, register the types for both the application and the Formly Designer:

```typescript
provideFormlyCore(withFormlyMaterial(), withFormlyEditorTypes());
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

### Configure editor

The editor can also be used independently of the full designer.

Use **provideFormlyEditor** to register the editor configuration.

- groupTypes - Define component types that can contain child components.
- formRenderConfig — Configure how the editor form and test form are rendered.
- properties — Define additional properties that can be exposed in the field editor.
- propertiesByType — Specify which properties are available for each component type.

### Configure editor components

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
