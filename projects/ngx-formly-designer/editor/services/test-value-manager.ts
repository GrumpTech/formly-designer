import { BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class TestValueManager implements OnDestroy {
  private changeSubject = new BehaviorSubject<any>(null);

  readonly onChange = this.changeSubject.asObservable();

  ngOnDestroy(): void {
    this.changeSubject.complete();
  }

  set(value: any): void {
    this.changeSubject.next(value);
  }
}
