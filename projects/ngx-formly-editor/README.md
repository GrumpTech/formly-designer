# ngx-formly-editor

Part of the [Formly Designer](https://github.com/GrumpTech/formly-designer#formly-designer) libraries. Provides the editor used by Formly Designer.

## Getting started

### Install

Run `npm i @grumptech/ngx-formly-editor`.

### Configure

Use **provideFormlyEditor** to register the editor configuration.

- groupTypes - Define component types that can contain child components.
- formRenderConfig — Configure how the editor form and test form are rendered.
- properties — Define additional properties that can be exposed in the field editor.
- propertiesByType — Specify which properties are available for each component type.

### Develop

- Run `npm install` to install the necessary npm packages.
- Run `npm run build` to build the library.
