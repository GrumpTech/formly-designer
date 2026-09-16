import { Result } from './models';

export function toFailedArrayResult(message: string): Result<[]> {
  return {
    success: false,
    message: message,
    result: [],
  };
}
