import { makeObservable, observable } from 'mobx';
import { AppError } from 'model';
import { Optional } from 'types';

export interface ILoadable {
  isLoading: boolean;
  isError: boolean;
  errors: AppError[];
  onError: Optional<(error: AppError) => void>;
  tryLoad: <T>(task: () => Promise<T>) => Promise<Optional<T>>;
}

export class Loadable implements ILoadable {
  isLoading = false;
  isError = false;
  errors: AppError[] = [];
  onError: Optional<(error: AppError) => void>;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      isError: observable,
      errors: observable,
    });
  }

  async tryLoad<T>(
    task: () => Promise<T>,
    onErrorCallback?: (error: AppError) => void,
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

      const appError = error as AppError;
      this.errors.push(appError);

      if (onErrorCallback) {
        onErrorCallback(appError);
      } else if (this.onError) {
        this.onError(appError);
      }
    }
  }
}
