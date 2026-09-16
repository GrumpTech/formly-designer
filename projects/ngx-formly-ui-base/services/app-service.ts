import { DestroyRef, inject, Injectable, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  catchError,
  concat,
  filter,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MenuItem } from '@grumptech/formly-converters';
import { BreadcrumbPart } from '@grumptech/ngx-basic-ui/breadcrumb';
import { AppProps, ErrorMessageProps, IFormLoader } from '../models';

interface Segment {
  segments: { [key: string]: Segment };
  url?: string;
  parameterName?: string;
}

@Injectable()
export class AppService {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected formLoader? = inject(IFormLoader, { optional: true });

  readonly url: Signal<string>;
  readonly formName: Signal<string>;
  readonly menu: Signal<MenuItem[]>;
  readonly breadcrumbParts: Signal<BreadcrumbPart[]>;
  readonly formFields: Signal<FormlyFieldConfig[]>;
  readonly pathParameters: Signal<{ [key: string]: string }>;

  private initialized = false;
  private segment: Segment = { segments: {} };
  private breadcrumbPartsByUrl = new Map<string, BreadcrumbPart[]>();
  private _url = signal<string>('');
  private _formName = signal<string>('');
  private _menu = signal<MenuItem[]>([]);
  private _breadcrumbParts = signal<BreadcrumbPart[]>([]);
  private _formFields = signal<FormlyFieldConfig[]>([]);
  private _pathParameters = signal<{ [key: string]: string }>({});
  private destroyRef = inject(DestroyRef);

  constructor() {
    if (!this.formLoader) {
      console.error('Provide formLoader via ProvideAppConfig.');
    }
    this.url = this._url.asReadonly();
    this.formName = this._formName.asReadonly();
    this.menu = this._menu.asReadonly();
    this.breadcrumbParts = this._breadcrumbParts.asReadonly();
    this.formFields = this._formFields.asReadonly();
    this.pathParameters = this._pathParameters.asReadonly();
  }

  initialize(field: FormlyFieldConfig<AppProps>): void {
    if (this.initialized) {
      throw 'Application was already initialized';
    }
    this.initialized = true;
    this.segment = { segments: {} };
    field.props?.pages?.forEach((i) => this.setSegments(i.url));
    this.breadcrumbPartsByUrl = new Map(
      field.props?.pages?.map((i) => [i.url, i.breadcrumbParts ?? []]) ?? [],
    );
    this._menu.set(field.props?.menu ?? []);
    this.updateOnNavigation();
  }

  private updateOnNavigation(): void {
    concat(
      of(void 0),
      this.router.events.pipe(
        filter(
          (e) => e instanceof NavigationEnd && this.url() !== this.getUrl(),
        ),
      ),
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.update()),
      )
      .subscribe();
  }

  private setSegments(url: string): void {
    const parts = url.split('/');
    const nParts = parts.length;
    if (nParts) {
      let segment = this.segment;
      for (let i = 0; i < nParts; i++) {
        const part = parts[i];
        if (part.startsWith('{')) {
          segment.parameterName = part.replace(/({|})/g, '');
        }
        segment.segments[part] ??= { segments: {} };
        segment = segment.segments[part];
      }
      segment.url = url;
    }
  }

  private update(): Observable<void> {
    const url = this.getUrl();
    this._url.set(url);
    const parts = url.split('/');
    const parameters: { [key: string]: string } = {};
    let segment = this.segment;
    for (let i = 0, l = parts.length; i < l; i++) {
      const part = parts[i];
      if (segment.segments[part]) {
        segment = segment.segments[part];
      } else if (
        segment.parameterName &&
        segment.segments[`{${segment.parameterName}}`]
      ) {
        parameters[segment.parameterName] = part;
        segment = segment.segments[`{${segment.parameterName}}`]; // ?
      } else {
        this._formName.set('');
        this._breadcrumbParts.set([]);
        this._formFields.set(
          url ? this.createErrorMessage('Error 404', 'Page not found') : [],
        );
        this._pathParameters.set({});
        return of(void 0);
      }
    }
    const formName = segment.url ?? '';
    let breadcrumbParts = structuredClone(
      this.breadcrumbPartsByUrl.get(formName) ?? [],
    );
    breadcrumbParts.forEach((i) => {
      i.label = i.label.startsWith('{')
        ? parameters[i.label.replace(/({|})/g, '')]
        : i.label;
      if (i.url) {
        i.url = i.url
          .split('/')
          .map((j) =>
            j.startsWith('{') ? parameters[j.replace(/({|})/g, '')] : j,
          )
          .join('/');
      }
    });
    if (this.formName() === formName) {
      this._breadcrumbParts.set(breadcrumbParts);
      this._pathParameters.set(parameters);
      return of(void 0);
    }
    this._formName.set(formName);

    // clear page while loading
    this._breadcrumbParts.set([]);
    this._formFields.set([]);
    this._pathParameters.set({});

    return (this.formLoader ? this.formLoader.load(formName) : of([])).pipe(
      catchError((error) => {
        breadcrumbParts = [];
        return concat(
          of(this.createErrorMessage('Error', 'Error loading page', error)),
        );
      }),
      map((fields) => {
        this._breadcrumbParts.set(breadcrumbParts);
        this._formFields.set(fields);
        this._pathParameters.set(parameters);
        return void 0;
      }),
    );
  }

  private getUrl(): string {
    let snapshot = this.route.snapshot;
    const result: string[] = [];
    while (snapshot.firstChild && (snapshot = snapshot.firstChild)) {
      result.push(snapshot.url.map((i) => i.path).join('/'));
    }
    return result.filter((i) => i).join('/');
  }

  private createErrorMessage(
    title: string,
    message: string,
    error: any = null,
  ): FormlyFieldConfig<ErrorMessageProps>[] {
    return [
      {
        type: 'message-container',
        fieldGroup: [{ type: 'error-message', props: { title, message } }],
      },
    ];
  }
}
