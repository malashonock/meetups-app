import { AxiosError } from 'axios';

import { errorInterceptor } from 'api';
import {
  AppError,
  NetworkError,
  NotAuthenticatedError,
  NotAuthorizedError,
  NotFoundError,
  ServerError,
} from 'model';

describe('axios error interceptor', () => {
  it('should convert an ERR_NETWORK error to a NetworkError instance', () => {
    const axiosNetworkError = {
      code: 'ERR_NETWORK',
    } as AxiosError;

    expect(() => errorInterceptor(axiosNetworkError)).toThrowError(
      NetworkError,
    );
  });

  it('should convert a 401 response to a NotAuthenticatedError instance', () => {
    const axios401Error = {
      response: {
        status: 401,
      },
    } as AxiosError;

    expect(() => errorInterceptor(axios401Error)).toThrowError(
      NotAuthenticatedError,
    );
  });

  it('should convert a 403 response to a NotAuthorizedError instance', () => {
    const axios403Error = {
      response: {
        status: 403,
      },
    } as AxiosError;

    expect(() => errorInterceptor(axios403Error)).toThrowError(
      NotAuthorizedError,
    );
  });

  it('should convert a 404 response to a NotFoundError instance', () => {
    const axios404Error = {
      response: {
        status: 404,
      },
    } as AxiosError;

    expect(() => errorInterceptor(axios404Error)).toThrowError(NotFoundError);
  });

  it('should convert a 500 response to a ServerError instance', () => {
    const axios500Error = {
      response: {
        status: 500,
      },
    } as AxiosError;

    expect(() => errorInterceptor(axios500Error)).toThrowError(ServerError);
  });

  it('should convert any other error response to an AppError instance', () => {
    const axios502Error = {
      response: {
        status: 502,
      },
    } as AxiosError;

    expect(() => errorInterceptor(axios502Error)).toThrowError(AppError);
  });
});
