# Formly Designer

Generate frontends. Instantly.

Formly Designer is built on top of [Formly](https://formly.dev) and consists of a visual form designer library and a library of frontend components. Together, these libraries make it possible to instantly generate a frontend from an OpenAPI specification.

- A live [demo](https://grumptech.github.io/demos/formly-designer) is available as a playground where you can edit Formly forms and generate a frontend from an OpenApi definition.
- Start developing quickly with Formly Designer in your own project using this [sample application](https://github.com/GrumpTech/formly-designer-sample#formly-designer-sample) as starting point.

Formly Designer is dual licensed to [support](https://grumptech.github.io/products/formly-designer/) continued development.

### Libraries

Formly Designer consists of these libraries:

- [@grumptech/ngx-formly-designer](projects/ngx-formly-designer/README.md) \
  A visual editor for creating Formly forms without manually writing their configuration.
- [@grumptech/ngx-formly-ui-base](projects/ngx-formly-ui-base/README.md) \
  A collection of reusable components and configuration for building frontend applications with Formly.
- [@grumptech/ngx-formly-ui-material](projects/ngx-formly-ui-material/README.md)\
  A collection of components extending `@ngx-formly/material` and `@grumptech/ngx-formly-ui-base`, designed for building frontend applications.
- [@grumptech/ngx-formly-ui-prime-ng](projects/ngx-formly-ui-prime-ng/README.md) \
  A collection of components extending `primeng` and `@grumptech/ngx-formly-ui-base`, designed for building frontend applications.
- [@grumptech/formly-field-validator](projects/formly-field-validator/README.md) \
  Creates an Ajv validator from a FormlyFieldConfig for validation of Angular Formly form definitions.
- [@grumptech/formly-converters](projects/formly-converters/README.md) \
  A collection of converter functions used across the Formly Designer libraries.
- [@grumptech/ngx-matx](https://github.com/GrumpTech/ngx-matx#ngx-matx) \
  Components built on top of Angular Material.
