import { DataManager } from '../../services/data-manager';
import {
  Component,
  AfterContentInit,
  model,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { jsonParse, jsonStringify } from '@grumptech/formly-converters';
import { MatxPanel, MatxPanelHeaderButton } from '@grumptech/ngx-matx/panel';
import { CodeEditor } from '@grumptech/ngx-basic-ui/code-editor';
import { FormEditorMode } from '../../modes';
import { ResultFormComponent } from './result-form.component';
import { ResultStructureComponent } from './result-structure.component';
import { ResultTestComponent } from './result-test.component';

@Component({
  selector: 'formly-designer-result',
  templateUrl: './result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ResultFormComponent,
    ResultStructureComponent,
    ResultTestComponent,
    MatxPanel,
    MatxPanelHeaderButton,
    CodeEditor,
  ],
})
export class ResultComponent implements AfterContentInit {
  readonly mode = model<FormEditorMode>('select');
  protected data = signal('');
  protected readonly formatter = (data: string) => {
    const result = jsonParse(data);
    return result.success ? jsonStringify(result.result) : data;
  };

  private dataManager = inject(DataManager);

  ngAfterContentInit() {
    this.dataManager.onChange.subscribe((fields) =>
      this.data.set(JSON.stringify(fields)),
    );
  }

  protected setMode(mode: FormEditorMode): void {
    this.mode.set(mode);
  }
}
