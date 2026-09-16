import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { filter, Observable, Subject } from 'rxjs';
import {
  ModificationState,
  TabsManager,
} from '@grumptech/ngx-matx/file-tab-bar';
import {
  MatxEditorApp,
  Tab,
  FileCommand,
  Result,
} from '@grumptech/ngx-matx/editor-app';
import { jsonParseFieldsAndValidate } from '@grumptech/formly-converters';
import {
  FormlyEditor,
  EditCommand,
  JsonExporter,
} from '@grumptech/ngx-formly-editor';
import { IFormLoader } from '@grumptech/ngx-formly-ui-base';
import { FormlyDesignerMenuBar } from '../menu-bar/menu-bar.component';
import { FormLoader } from '../services/form-loader';
import { ImportManager } from '../services/import-manager';
import { ExportManager } from '../services/export-manager';

@Component({
  selector: 'formly-designer',
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss',
  imports: [FormlyDesignerMenuBar, MatxEditorApp, FormlyEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IFormLoader, useClass: FormLoader }],
})
export class FormlyDesigner {
  protected convert: (content: string) => Result<FormlyFieldConfig[]>;
  protected convertBack: (data: FormlyFieldConfig[]) => string;
  protected importManager = inject(ImportManager);
  protected exportManager = inject(ExportManager);
  protected importerNames = this.importManager.getNames();
  protected exporterNames = this.exportManager.getNames();
  protected tabs: Signal<Tab<FormlyFieldConfig[]>[]>;
  protected selectedTab: Signal<Tab<FormlyFieldConfig[]> | null>;
  protected readonly onFileCommand: Observable<FileCommand>;
  protected readonly onEditCommand: Observable<EditCommand>;

  private jsonExporter = inject(JsonExporter);
  private tabsManager = inject(TabsManager<Tab<FormlyFieldConfig[]>>);
  private readonly command = new Subject<FileCommand | EditCommand>();

  constructor() {
    this.onFileCommand = this.command.pipe(
      filter((i) => i instanceof FileCommand),
    );
    this.onEditCommand = this.command.pipe(
      filter((i) => i instanceof EditCommand),
    );
    this.tabs = toSignal(this.tabsManager.onChange, { initialValue: [] });
    this.selectedTab = toSignal(this.tabsManager.onSelectionChange, {
      initialValue: null,
    });
    this.convert = (content) => jsonParseFieldsAndValidate(content);
    this.convertBack = (data) => this.jsonExporter.export(data);
  }

  hasModifiedTabs(): boolean {
    return this.tabsManager.hasModifiedTab();
  }

  protected handleCommand(command: FileCommand | EditCommand): void {
    this.command.next(command);
  }

  protected handleDataChange(tab: Tab<FormlyFieldConfig[]>): void {
    this.tabsManager.update(tab, {
      modificationState:
        tab.modificationState === ModificationState.New
          ? ModificationState.New
          : ModificationState.Unknown,
    });
  }
}
