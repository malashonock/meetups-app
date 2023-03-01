import { AxiosError } from 'axios';
import { makeObservable, observable } from 'mobx';
import { Optional } from 'types';

export interface ILoadable {
  isLoading: boolean;
  isError: boolean;
  errors: unknown[];
  onLoadError: Optional<(error: LoadError) => void>;
  tryLoad: <T>(task: () => Promise<T>) => Promise<Optional<T>>;
}

export class Loadable implements ILoadable {
  isLoading = false;
  isError = false;
  errors: unknown[] = [];
  onLoadError: Optional<(error: LoadError) => void>;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      isError: observable,
      errors: observable,
    });
  }

  async tryLoad<T>(
    task: () => Promise<T>,
    onErrorCallback?: (error: LoadError) => void,
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
      const loadError = new LoadError(
        code || 'UNKNOWN_ERROR',
        message,
        response?.status,
      );

      this.errors.push(loadError);

      if (onErrorCallback) {
        onErrorCallback(loadError);
      } else if (this.onLoadError) {
        this.onLoadError(loadError);
      }
    }
  }
}

export class LoadError {
  public constructor(
    public code: string,
    public message: string,
    public status?: number,
  ) {}
}
