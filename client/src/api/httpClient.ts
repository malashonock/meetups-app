import axios, { AxiosError, AxiosResponse } from 'axios';

import { API_BASE_URL } from 'api/constants';
import {
  AppError,
  NetworkError,
  NotAuthenticatedError,
  NotAuthorizedError,
  NotFoundError,
  ServerError,
} from 'model';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const errorInterceptor = (error: AxiosError) => {
  if (error.code === 'ERR_NETWORK') {
    throw new NetworkError();
  }

  switch (error.response?.status) {
    case 401:
      throw new NotAuthenticatedError();
    case 403:
      throw new NotAuthorizedError();
    case 404:
      throw new NotFoundError();
    case 500:
      throw new ServerError();
    default:
      throw new AppError(
        error.response?.status.toString() || error.code || 'UNKNOWN_ERROR',
        error.name,
        error.message,
      );
  }
};

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  errorInterceptor,
);
