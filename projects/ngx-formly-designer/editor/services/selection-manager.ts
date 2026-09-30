import { BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class SelectionManager<T> implements OnDestroy {
  private selection = new Set<T>();
  private selectSubject = new BehaviorSubject<T | null>(null);

  readonly onSelect = this.selectSubject.asObservable();

  ngOnDestroy(): void {
    this.selectSubject.complete();
  }

  has(key: T): boolean {
    return this.selection.has(key);
  }

  get(): T[] {
    return [...this.selection.keys()];
  }

  getLast(): T | null {
    return this.selectSubject.value;
  }

  set(selection: T[]): void {
    this.selection = new Set<T>(selection);
    const last = this.selectSubject.value;
    this.next(last && !this.selection.has(last) ? null : last);
  }

  replace(oldKey: T, newKey: T) {
    if (this.selection.has(oldKey)) {
      this.selection.delete(oldKey);
      this.selection.add(newKey);
      this.next(newKey);
    }
  }

  clear(): void {
    if (this.selection.size !== 0) {
      this.selection.clear();
    }
    this.next(null);
  }

  select(key: T | null, ctrlKey: boolean, shiftKey: boolean): void {
    if (key === null) {
      return this.clear();
    }
    if (ctrlKey || shiftKey) {
      return this.toggle(key);
    }
    if (this.selection.has(key) && this.selection.size === 1) {
      return this.next(key);
    }
    this.selection.clear();
    this.selection.add(key);
    this.next(key);
  }

  private toggle(key: T): void {
    if (this.selection.has(key)) {
      this.selection.delete(key);
      this.next(null);
    } else {
      this.selection.add(key);
      this.next(key);
    }
  }

  private next(key: T | null) {
    this.selectSubject.next(key);
  }
}
