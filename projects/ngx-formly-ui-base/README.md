# ngx-formly-base

A collection of reusable components and configuration for building frontend applications with Formly.

## Getting started

### Install

Run `npm i @grumptech/ngx-formly-base`.

### Configure

Start by configuring Formly with the base Formly components and their associated configuration:

```typescript
provideFormlyCore(withFormlyUiBase());
```

If Formly is already configured, add the Formly base components to the existing configuration instead:

```typescript
provideFormlyConfig(withFormlyUiBase());
```

The base components provide the building blocks for composing a complete frontend application. Use `provideFormlyAppConfig` to configure application-specific behavior:

```typescript
provideFormlyAppConfig({
  baseUrl: "/api",
  formLoader: MyFormLoader,
  messageService: MyMessageService,
});
```

See [demo-app](/projects/demo-app/src/app/app.config.ts) for a complete example.

The following options are available:

| Option            | Required | Description                                                                                       |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `baseUrl`         | Yes      | Base URL of the backend API.                                                                      |
| `frontendBaseUrl` | No       | Base URL of the frontend application.                                                             |
| `actions`         | No       | Replaces the default actions with the specified custom actions.                                   |
| `converters`      | No       | Replaces the default converters with the specified custom converters.                             |
| `formLoader`      | Yes      | Provides a form loader implementation. Required if no form loader is provided by another package. |
| `messageService`  | No       | Provides a message service implementation. Defaults to writing messages to the console.           |

### Components

The library provides three components for loading and rendering forms:

- **FormLoader** — loads and renders an form by its name.
- **PageLoader** — loads and renders a form based on the current route.
- **AppLoader** — loads an application component using the conventional name 'formly-app'.

For applications with multiple pages, configure the Angular routes with AppLoader as the root component and PageLoader as the catch-all child route:

```typescript
export const routes: Route[] = [
  {
    path: "app",
    component: AppLoader,
    children: [{ path: "**", component: PageLoader }],
  },
];
```

With this configuration, AppLoader loads the application component, while PageLoader loads individual pages based on their routes.

### Develop

- Run `npm install` to install the necessary npm packages.
- Run `npm run build` to build the library.
