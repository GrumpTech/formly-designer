import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UndoManager<T> implements OnDestroy {
  private states: string[] = [];
  private currentState = 0;
  private change = new Subject<T>();

  readonly onChange = this.change.asObservable();

  ngOnDestroy() {
    this.change.complete();
  }

  push(state: T): void {
    if (this.currentState < this.states.length - 1) {
      this.states.splice(this.currentState + 1);
    }
    this.states.push(JSON.stringify(state));
    this.currentState = this.states.length - 1;
  }

  clear() {
    this.states.splice(0, this.states.length - 1);
    this.currentState = 0;
  }

  undo(): void {
    if (this.currentState > 0) {
      this.currentState--;
      this.change.next(JSON.parse(this.states[this.currentState]));
    }
  }

  redo(): void {
    if (this.currentState < this.states.length - 1) {
      this.currentState++;
      this.change.next(JSON.parse(this.states[this.currentState]));
    }
  }
}
