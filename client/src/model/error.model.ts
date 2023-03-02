import i18n from 'i18n';

export class AppError {
  constructor(
    public code: string,
    public problem: string,
    public hint: string,
  ) {}
}

export class NetworkError extends AppError {
  constructor(
    code: string = 'ERR_NETWORK',
    problem: string = i18n.t('alerts.networkError.problem'),
    hint: string = i18n.t('alerts.networkError.hint'),
  ) {
    super(code, problem, hint);
  }
}

export class NotAuthenticatedError extends AppError {
  constructor(
    code: string = '401',
    problem: string = i18n.t('alerts.notAuthenticatedError.problem'),
    hint: string = i18n.t('alerts.notAuthenticatedError.hint'),
  ) {
    super(code, problem, hint);
  }
}

export class NotAuthorizedError extends AppError {
  constructor(
    code: string = '403',
    problem: string = i18n.t('alerts.notAuthorizedError.problem'),
    hint: string = i18n.t('alerts.notAuthorizedError.hint'),
  ) {
    super(code, problem, hint);
  }
}

export class NotFoundError extends AppError {
  constructor(
    code: string = '404',
    problem: string = i18n.t('alerts.notFoundError.problem'),
    hint: string = i18n.t('alerts.notFoundError.hint'),
  ) {
    super(code, problem, hint);
  }
}

export class ServerError extends AppError {
  constructor(
    code: string = '500',
    problem: string = i18n.t('alerts.serverError.problem'),
    hint: string = i18n.t('alerts.serverError.hint'),
  ) {
    super(code, problem, hint);
  }
}
