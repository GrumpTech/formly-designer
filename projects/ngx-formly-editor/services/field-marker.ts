import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({ providedIn: 'root' })
export class FieldMarker {
  private readonly FORMLY_DESIGNER_CLASS_PREFIX =
    'formly-designer-class-prefix_';

  markField(field: FormlyFieldConfig, id: string): void {
    field.className =
      (field.className ? `${field.className} ` : '') +
      `${this.FORMLY_DESIGNER_CLASS_PREFIX}${id}`;
  }

  getIdFromElement(element: Element): string | null {
    for (let i = 0, l = element.classList.length; i < l; i++) {
      const cssClass = element.classList[i];
      if (cssClass.startsWith(this.FORMLY_DESIGNER_CLASS_PREFIX)) {
        return cssClass.replace(this.FORMLY_DESIGNER_CLASS_PREFIX, '');
      }
    }
    return null;
  }
}
