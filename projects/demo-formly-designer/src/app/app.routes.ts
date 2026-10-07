import { inject, Provider, Type } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map, of } from 'rxjs';
import { provideFormlyConfig, provideFormlyCore } from '@ngx-formly/core';
import { MatxConfirmationDialog } from '@grumptech/ngx-matx/confirmation-dialog';
import { provideFormlyAppConfig } from '@grumptech/ngx-formly-ui-base/core';
import { IMessageService } from '@grumptech/ngx-formly-ui-base/defs';
import {
  provideFormsLoader,
  EmptyFormLoader,
  IFormsLoader,
} from '@grumptech/ngx-formly-ui-base/loaders';
import { withFormlyUiMaterial } from '@grumptech/ngx-formly-ui-material';
import { MessageService as MaterialMessageService } from '@grumptech/ngx-formly-ui-material/core';
import { withFormlyUiPrimeNg } from '@grumptech/ngx-formly-ui-prime-ng';
import { MessageService as PrimeNgMessageService } from '@grumptech/ngx-formly-ui-prime-ng/core';
import { withFormlyEditorTypes } from '@grumptech/ngx-formly-designer/ui-editor';
import {
  FormLoader,
  FormlyDesigner,
  provideFormlyDesigner,
} from '@grumptech/ngx-formly-designer/designer';
import {
  provideImporter,
  ExtendedOpenApiAppImporter,
  FormLoaderFromImporter,
} from '@grumptech/ngx-formly-designer/importers';
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
      provideFormlyCore(withFormlyUiMaterial()),
      provideFormlyAppConfig({
        baseUrl: apiPath,
        formLoader: EmptyFormLoader,
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
      provideFormlyCore(withFormlyUiPrimeNg()),
      provideFormlyAppConfig({
        baseUrl: apiPath,
        formLoader: EmptyFormLoader,
        frontendBaseUrl: '/prime-ng/app/',
        messageService: PrimeNgMessageService,
      }),
      provideFormlyDesigner(designerConfig),
    ],
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./pages/info/info.component').then((m) => m.Info),
  },
];

function getChildRoutes(messageService: Type<IMessageService>): Routes {
  const result: Route[] = [
    {
      path: '',
      loadComponent: () =>
        import('@grumptech/ngx-formly-designer/designer').then(
          (m) => m.FormlyDesigner,
        ),
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
      providers: [provideFormlyConfig(withFormlyEditorTypes())],
    },
  ];
  result.push(getAppRoute('app', messageService, FormLoader));
  result.push(
    getAppRoute('open-api-client', messageService, FormLoaderFromImporter, [
      provideImporter({
        url: swaggerPath,
        importer: ExtendedOpenApiAppImporter,
      }),
    ]),
  );
  return result;
}

function getAppRoute(
  path: string,
  messageService: Type<IMessageService>,
  formLoader: Type<IFormsLoader>,
  providers: Provider = [],
): Route {
  return {
    path: path,
    loadComponent: () =>
      import('./pages/wrapper/wrapper.component').then((m) => m.Wrapper),
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('@grumptech/ngx-formly-ui-base/loaders').then(
            (m) => m.PageLoader,
          ),
      },
    ],
    providers: [
      providers,
      provideFormlyAppConfig({
        baseUrl: apiPath,
        formLoader: formLoader,
        frontendBaseUrl: '',
        messageService: messageService,
      }),
      provideFormsLoader(formLoader),
    ],
  };
}
