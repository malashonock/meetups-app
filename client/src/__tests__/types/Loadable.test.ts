import * as MobX from 'mobx';

import { Loadable } from 'types';
import { AppError, ServerError } from 'model';

const spiedOnMobXMakeObservable = jest.spyOn(MobX, 'makeObservable');

describe('Loadable class', () => {
  describe('constructor', () => {
    it('should call makeObservable', () => {
      new Loadable();
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
      const loadable = new Loadable();

      expect(loadable.isLoading).toBe(false);
      expect(loadable.isError).toBe(false);
      expect(loadable.errors.length).toBe(0);
      expect(loadable.onError).toBeUndefined();
    });
  });

  describe('tryLoad() instance method', () => {
    it('should track successful load correctly', async () => {
      const mockSuccessfulTask = jest.fn().mockResolvedValue('Success');
      const loadable = new Loadable();

      const task = loadable.tryLoad(mockSuccessfulTask);

      expect(loadable.isLoading).toBe(true);
      expect(loadable.isError).toBe(false);
      expect(loadable.errors.length).toBe(0);

      const result = await task;

      expect(result).toBe('Success');
      expect(loadable.isLoading).toBe(false);
      expect(loadable.isError).toBe(false);
      expect(loadable.errors.length).toBe(0);
    });

    it('should catch errors correctly', async () => {
      const mockServerError = new ServerError();
      const mockFailedTask = jest.fn().mockRejectedValue(mockServerError);
      const mockErrorHandler = jest.fn();

      const loadable = new Loadable();

      const task = loadable.tryLoad(mockFailedTask);

      expect(loadable.isLoading).toBe(true);
      expect(loadable.isError).toBe(false);
      expect(loadable.errors.length).toBe(0);

      const result = await task;

      expect(result).toBeUndefined();
      expect(loadable.isLoading).toBe(false);
      expect(loadable.isError).toBe(true);
      expect(loadable.errors.length).toBe(1);
      expect(loadable.errors[0] instanceof AppError).toBe(true);
      expect(mockErrorHandler).not.toHaveBeenCalledWith();
    });

    it('should call onError callback by default', async () => {
      const mockServerError = new ServerError();
      const mockFailedTask = jest.fn().mockRejectedValue(mockServerError);
      const mockErrorHandler = jest.fn();

      const loadable = new Loadable();
      loadable.onError = mockErrorHandler;

      const task = loadable.tryLoad(mockFailedTask);

      await task;

      expect(mockErrorHandler).toHaveBeenCalledWith(mockServerError);
    });

    it('should call custom error handler, if any', async () => {
      const mockServerError = new ServerError();
      const mockFailedTask = jest.fn().mockRejectedValue(mockServerError);
      const mockErrorHandler = jest.fn();
      const mockCustomErrorHandler = jest.fn();

      const loadable = new Loadable();
      loadable.onError = mockErrorHandler;

      const task = loadable.tryLoad(mockFailedTask, mockCustomErrorHandler);

      await task;

      expect(mockErrorHandler).not.toHaveBeenCalled();
      expect(mockCustomErrorHandler).toHaveBeenCalledWith(mockServerError);
    });
  });
});
