import { Route } from '@angular/router';
import { AppLoader, PageLoader } from '@grumptech/ngx-formly-ui-base';
import { CustomPage } from './pages/custom-page/custom-page.component';
import { CustomApp } from './components/custom-app/custom-app.component';

export const routes: Route[] = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: 'custom-app',
    component: CustomApp,
    children: [
      { path: 'custom-page', component: CustomPage },
      { path: 'Rest/Application/:Id', component: PageLoader },
      { path: '**', component: PageLoader },
    ],
  },
  {
    path: 'app',
    component: AppLoader,
    children: [
      { path: 'custom-page', component: CustomPage },
      { path: 'Rest/Application/:Id', component: PageLoader },
      { path: '**', component: PageLoader },
    ],
  },
];
