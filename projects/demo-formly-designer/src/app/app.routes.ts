import { inject, Provider, Type } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map, of } from 'rxjs';
import { MatxConfirmationDialog } from '@grumptech/ngx-matx/confirmation-dialog';
import {
  IMessageService,
  provideFormlyAppConfig,
} from '@grumptech/ngx-formly-ui-base';
import {
  withFormlyUiMaterial,
  MessageService as MaterialMessageService,
} from '@grumptech/ngx-formly-ui-material';
import {
  withFormlyUiPrimeNg,
  MessageService as PrimeNgMessageService,
} from '@grumptech/ngx-formly-ui-prime-ng';
import { withFormlyEditorTypes } from '@grumptech/ngx-formly-ui-editor';
import {
  FormLoader,
  FormlyDesigner,
  provideFormlyDesigner,
} from '@grumptech/ngx-formly-designer';
import {
  provideFormsLoader,
  provideFormsLoaderFromImporter,
} from '@grumptech/ngx-formly-form-loaders';
import { ExtendedOpenApiAppImporter } from '@grumptech/ngx-formly-importers';
import {
  provideFormlyConfigScoped,
  provideFormlyCoreScoped,
} from './extensions/formly-providers';
import { designerConfig } from './config/designer-config';
import { getApiPath, getSwaggerPath } from './methods/methods';

const apiPath = getApiPath();
const swaggerPath = getSwaggerPath();

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'material',
    pathMatch: 'full',
  },
  {
    path: 'material',
    children: getChildRoutes(MaterialMessageService),
    providers: [
      provideFormlyCoreScoped(withFormlyUiMaterial()),
      provideFormlyAppConfig({
        baseUrl: apiPath,
        frontendBaseUrl: '/material/app/',
        messageService: MaterialMessageService,
      }),
      provideFormlyDesigner(designerConfig),
    ],
  },
  {
    path: 'prime-ng',
    children: getChildRoutes(PrimeNgMessageService),
    providers: [
      provideFormlyCoreScoped(withFormlyUiPrimeNg()),
      provideFormlyAppConfig({
        baseUrl: apiPath,
        frontendBaseUrl: '/prime-ng/app/',
        messageService: PrimeNgMessageService,
      }),
      provideFormlyDesigner(designerConfig),
    ],
  },
];

function getChildRoutes(messageService: Type<IMessageService>): Routes {
  const result: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('@grumptech/ngx-formly-designer').then((m) => m.FormlyDesigner),
      canDeactivate: [
        (component: FormlyDesigner) =>
          component.hasModifiedTabs()
            ? inject(MatDialog)
                .open(MatxConfirmationDialog, {
                  data: {
                    title: 'Leaving designer?',
                    message: `Unsaved changes will be lost.`,
                  },
                })
                .afterClosed()
                .pipe(map((confirmed) => confirmed === true))
            : of(true),
      ],
      providers: [provideFormlyConfigScoped(withFormlyEditorTypes())],
    },
  ];
  result.push(
    getAppRoute('app', messageService, provideFormsLoader(FormLoader)),
  );
  result.push(
    getAppRoute(
      'open-api-client',
      messageService,
      provideFormsLoaderFromImporter({
        url: swaggerPath,
        importer: ExtendedOpenApiAppImporter,
      }),
    ),
  );
  return result;
}

function getAppRoute(
  path: string,
  messageService: Type<IMessageService>,
  formsLoader: Provider,
): Route {
  return {
    path: path,
    loadComponent: () =>
      import('./pages/wrapper/wrapper.component').then((m) => m.Wrapper),
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('@grumptech/ngx-formly-ui-base').then((m) => m.PageLoader),
      },
    ],
    providers: [
      formsLoader,
      provideFormlyAppConfig({
        baseUrl: apiPath,
        frontendBaseUrl: '',
        messageService: messageService,
      }),
    ],
  };
}
