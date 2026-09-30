import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { CodeEditor } from '@grumptech/ngx-basic-ui/code-editor';
import { jsonParse, jsonStringify } from '@grumptech/formly-converters';
import { MatxPanel } from '@grumptech/ngx-matx/panel';
import { TestValueManager } from '../../services/test-value-manager';

@Component({
  selector: 'formly-designer-test-value',
  templateUrl: './test-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatxPanel, CodeEditor],
})
export class TestValueComponent {
  protected data: Observable<string>;
  protected readonly formatter = (data: string) => {
    const result = jsonParse(data);
    return result.success ? jsonStringify(result.result) : data;
  };

  constructor() {
    this.data = inject(TestValueManager).onChange.pipe(
      map((value) => JSON.stringify(value ?? {})),
    );
  }
}
