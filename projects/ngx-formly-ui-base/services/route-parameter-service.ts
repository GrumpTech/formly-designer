import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { concat, filter, map, Observable, of } from 'rxjs';
import { AppService } from './app-service';

export interface Parameters {
  path?: { [key: string]: any };
  query?: { [key: string]: any };
}

@Injectable()
export class RouteParameterService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected appService = inject(AppService, { optional: true });

  readonly events: Observable<void>;
  private destroyRef = inject(DestroyRef);

  constructor() {
    const appService = this.appService;

    const path = appService?.formName() ?? this.route.routeConfig?.path;
    this.events = concat(
      of(void 0),
      this.router.events.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(
          (e) =>
            e instanceof NavigationEnd &&
            (appService?.formName() ?? this.route.routeConfig?.path) === path,
        ),
        map(() => void 0),
      ),
    );
  }

  get(): Parameters {
    const path: any = {};
    const snapshot = this.route.snapshot;
    if (this.appService) {
      Object.assign(path, this.appService.pathParameters());
    } else {
      const matches = [
        ...(snapshot.routeConfig?.path?.matchAll(/\:([^\/]+)(\/|$)/g) ?? []),
      ];
      matches.forEach((j) => (path[j[1]] = snapshot.params[j[1]]));
    }
    const query = snapshot.queryParams;
    const result: Parameters = {};
    Object.keys(path).length && (result.path = path);
    Object.keys(query).length && (result.query = query);
    return result;
  }

  set(parameters: Parameters) {
    if (!this.isValid(parameters)) {
      return;
    }
    const currentParameters = this.get();
    const url = this.createUrl({
      ...currentParameters.path,
      ...parameters.path,
    });
    this.router.navigate([url], {
      relativeTo: this.route.parent,
      queryParams: { ...currentParameters.query, ...parameters.query },
    });
  }

  hasChanged(parameters: Parameters): boolean {
    if (!this.isValid(parameters)) {
      return false;
    }
    const currentParameters = this.get();
    for (const key in parameters.path) {
      if (!currentParameters.path || !currentParameters.path[key]) {
        continue;
      }
      if (`${parameters.path[key]}` !== `${currentParameters.path[key]}`) {
        return true;
      }
    }
    for (const key in parameters.query) {
      if (!currentParameters.query || !parameters.query[key]) {
        return true;
      }
      const value = parameters.query[key];
      const currentValue = currentParameters.query[key];
      if (Array.isArray(value)) {
        if (
          !Array.isArray(currentValue) ||
          value.length != currentValue.length ||
          !value.every((i, idx) => `${i}` === `${currentValue[idx]}`)
        ) {
          return true;
        }
      } else if (`${value}` !== `${currentValue}`) {
        return true;
      }
    }
    return false;
  }

  private isValid(parameters: Parameters): boolean {
    if (
      parameters.path &&
      Object.values(parameters.path).some((i) => typeof i === 'object')
    ) {
      console.error(
        'Path parameters may not contain objects, other than arrays.',
      );
      return false;
    }
    if (
      parameters.query &&
      Object.values(parameters.query).some(
        (i) => typeof i === 'object' && !Array.isArray(i),
      )
    ) {
      console.error(
        'Query parameters may not contain objects, other than arrays.',
      );
      return false;
    }
    return true;
  }

  private createUrl(pathParameters: { [key: string]: any }): string {
    let result = '';
    const matches = [];
    if (this.appService) {
      result = this.appService.formName();
      matches.push(...result.matchAll(/\{([^\{\}\/]+)\}(\/|$)/g));
    } else {
      result === '**'
        ? this.route.snapshot.url.map((i) => i.path).join('/')
        : result;
      matches.push(...result.matchAll(/\:([^\/]+)(\/|$)/g));
    }
    matches.forEach(
      (i) => (result = result.replace(i[0], `${pathParameters[i[1]]}${i[2]}`)),
    );
    return result;
  }
}
