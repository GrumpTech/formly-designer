import {
  Component,
  OnInit,
  output,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { map, startWith, Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataManager } from '../../services/data-manager';
import { FieldTypesReader } from '../../services/field-types-reader';
import { EditorConfigReader } from '../../services/editor-config-reader';

@Component({
  selector: 'formly-designer-field-editor-add',
  template: `
    <mat-form-field floatLabel="always">
      <mat-label>type</mat-label>
      <input
        matInput
        [matAutocomplete]="autocomplete"
        [formControl]="formControl"
        (keydown.enter)="commit()"
      />
      <mat-autocomplete
        autoActiveFirstOption
        #autocomplete="matAutocomplete"
        (optionSelected)="handleSelect($event)"
      >
        @for (option of filteredTypes | async; track option) {
          <mat-option [value]="option" (click)="handleClick()">
            {{ option }}
          </mat-option>
        }
      </mat-autocomplete>
      <mat-error>Select value from list</mat-error>
    </mat-form-field>
    <button mat-stroked-button color="primary" (click)="commit()">
      <mat-icon>add</mat-icon>
      Add field
    </button>
  `,
  host: {
    '(focusout)': 'handleFocusout()',
  },
  styles: [
    `
      mat-form-field {
        margin-right: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatInput,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
})
export class FormlyFieldEditorAdd implements OnInit {
  protected types: string[] = [];
  readonly optionSelected = output<string>();
  formControl!: FormControl;
  filteredTypes!: Observable<string[]>;

  private fieldTypesReader = inject(FieldTypesReader);
  private editorConfigReader = inject(EditorConfigReader);
  private dataManager = inject(DataManager);
  private commitHandled = false;

  ngOnInit(): void {
    this.types = this.fieldTypesReader
      .get()
      .filter((i) => this.editorConfigReader.propertiesByType[i])
      .sort((x, y) => x.localeCompare(y));
    this.formControl = new FormControl('', this.inListValidator(this.types));
    this.filteredTypes = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        value = value.toLowerCase();
        return this.types.filter((option) =>
          option.toLowerCase().includes(value),
        );
      }),
    );
  }

  protected handleFocusout() {
    this.formControl.markAsUntouched();
  }

  protected handleClick() {
    this.commitHandled = false;
  }

  protected handleSelect(event: MatAutocompleteSelectedEvent): void {
    event.option.deselect();
    this.select(event.option.value);
    this.commitHandled = true;
  }

  protected commit() {
    if (this.commitHandled) {
      this.commitHandled = false;
      return;
    }
    const value = (this.formControl.value ?? '').toLowerCase();
    const selection = this.types.filter((i) => i.toLowerCase() === value);
    if (selection.length) {
      this.select(selection[0]);
    } else {
      this.formControl.markAsTouched();
    }
  }

  private select(value: string) {
    const field: FormlyFieldConfig = { type: value };
    this.dataManager.addFields([field]);
    this.formControl.reset('');
  }

  private inListValidator(items: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const valid = items.some((i) => i.toLowerCase() === value);
      return valid ? null : { notInList: true };
    };
  }
}
