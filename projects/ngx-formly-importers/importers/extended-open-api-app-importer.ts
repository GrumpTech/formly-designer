import { Injectable, inject } from '@angular/core';
import { OpenApiAppImporter } from './open-api-app-importer';
import { ExtendedOpenApiImporter } from './extended-open-api-importer';

@Injectable({ providedIn: 'root' })
export class ExtendedOpenApiAppImporter extends OpenApiAppImporter {
  protected openApiImporter = inject(ExtendedOpenApiImporter);
}
