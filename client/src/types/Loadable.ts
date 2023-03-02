import { AxiosError } from 'axios';
import { makeObservable, observable } from 'mobx';
import { Optional, ServerError } from 'types';

export interface ILoadable {
  isLoading: boolean;
  isError: boolean;
  errors: unknown[];
  onError: Optional<(error: ServerError) => void>;
  tryLoad: <T>(task: () => Promise<T>) => Promise<Optional<T>>;
}

export class Loadable implements ILoadable {
  isLoading = false;
  isError = false;
  errors: unknown[] = [];
  onError: Optional<(error: ServerError) => void>;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      isError: observable,
      errors: observable,
    });
  }

  async tryLoad<T>(
    task: () => Promise<T>,
    onErrorCallback?: (error: ServerError) => void,
  ): Promise<Optional<T>> {
    try {
      this.isLoading = true;

      const result = await task();

      this.isLoading = false;
      this.isError = false;

      return result;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;

      const { code, message, response } = error as AxiosError;
      const serverError = new ServerError(
        code || 'UNKNOWN_ERROR',
        message,
        response?.status,
      );

      this.errors.push(serverError);

      if (onErrorCallback) {
        onErrorCallback(serverError);
      } else if (this.onError) {
        this.onError(serverError);
      }
    }
  }
}
