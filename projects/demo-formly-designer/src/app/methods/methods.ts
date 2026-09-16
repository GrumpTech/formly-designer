import { environment } from '../../environments/environment';

export function getApiPath() {
  return environment.useSettings
    ? (localStorage.getItem(
        `${environment.storagePrefix}settings_backend_url`,
      ) ?? '')
    : '/api';
}

export function getSwaggerPath() {
  return environment.useSettings
    ? (localStorage.getItem(
        `${environment.storagePrefix}settings_swagger_url`,
      ) ?? '')
    : '/api/swagger/v1/swagger.json';
}
