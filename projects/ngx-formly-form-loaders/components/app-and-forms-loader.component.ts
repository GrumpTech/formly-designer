import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { AppLoader, IFormLoader } from '@grumptech/ngx-formly-ui-base';
import { FormsLoader } from './forms-loader.component';
import { AppLoader as AppLoaderService } from '../services/app-loader';

@Component({
  selector: 'formly-app-and-forms-loader',
  template: `
    <div class="app-container">
      @if (allForms | async) {
        <formly-forms-loader />
      } @else {
        <formly-app-loader />
      }
    </div>
    <div class="menu-toggle">
      <mat-icon
        matTooltip="App"
        (click)="toggleAllForms(false)"
        [class.selected]="(allForms | async) !== true"
        >unfold_less</mat-icon
      >
      <mat-icon
        matTooltip="All forms"
        (click)="toggleAllForms(true)"
        [class.selected]="allForms | async"
        >unfold_more</mat-icon
      >
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
      }

      .error-message {
        padding: 10px;
        white-space: pre-line;
      }

      .app-container {
        width: 100%;
        height: 100%;
      }

      formly-app-loader {
        flex: 1;
      }

      .menu-toggle {
        position: absolute;
        top: 0px;
        right: 15px;
        cursor: pointer;
        mat-icon:not(.selected):not(:active:hover) {
          color: lightgray;
        }
      }
    `,
  ],
  imports: [AsyncPipe, MatIcon, MatTooltip, AppLoader, FormsLoader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IFormLoader, useClass: AppLoaderService }],
})
export class AppAndFormsLoader implements OnInit {
  protected allForms?: Observable<boolean>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.allForms = this.route.params.pipe(
      map((i) => 'allForms' in i),
      distinctUntilChanged(),
    );
  }

  protected toggleAllForms(newValue: boolean): void {
    const commands: any[] = [newValue ? { allForms: '' } : {}];
    let snapshot = this.route.snapshot;
    while (snapshot.firstChild && (snapshot = snapshot.firstChild)) {
      commands.push(
        ...snapshot.url.flatMap((u) =>
          u.parameters ? [u.path, u.parameters] : [u.path],
        ),
      );
    }
    this.router.navigate(commands, {
      relativeTo: this.route,
      preserveFragment: true,
      queryParamsHandling: 'preserve',
    });
  }
}
