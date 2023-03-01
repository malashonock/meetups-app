import { makeObservable, observable } from 'mobx';
import { Optional } from 'types';

export interface ILoadable {
  isLoading: boolean;
  isError: boolean;
  errors: unknown[];
  tryLoad: <T>(task: () => Promise<T>) => Promise<Optional<T>>;
}

export class Loadable implements ILoadable {
  isLoading: boolean;
  isError: boolean;
  errors: unknown[];

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      isError: observable,
      errors: observable,
    });

    this.isLoading = false;
    this.isError = false;
    this.errors = [];
  }

  async tryLoad<T>(task: () => Promise<T>): Promise<Optional<T>> {
    try {
      this.isLoading = true;

      const result = await task();

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;

      return result;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }
}
