import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { FORMLY_APP_CONFIG } from '../config';

@Injectable()
export class HttpCacheService {
  private httpClient = inject(HttpClient);
  private appConfig = inject(FORMLY_APP_CONFIG);
  private cache: { [key: string]: Observable<any> } = {};

  getData(url: string): Observable<any> {
    this.cache[url] ??= this.httpClient
      .get(`${this.appConfig.baseUrl}${url}`)
      .pipe(
        tap({
          error: () => delete this.cache[url],
        }),
        shareReplay(1),
      );
    return this.cache[url];
  }

  clearCache(url: string): void {
    delete this.cache[url];
  }
}
