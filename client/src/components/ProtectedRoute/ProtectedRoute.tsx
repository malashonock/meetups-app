import { PropsWithChildren, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { LoadingSpinner, RootContext } from 'components';
import { useAuthStore } from 'hooks';
import { AlertSeverity } from 'types';
import { NotAuthenticatedError, NotAuthorizedError } from 'model';

export enum RedirectCondition {
  Authenticated = 'authenticated',
  NonAdmin = 'nonAdmin',
  Unauthenticated = 'unauthenticated',
}

interface ProtectedRouteProps {
  redirectIf?: RedirectCondition;
  redirectTo?: string;
}

export const ProtectedRoute = observer(
  ({
    redirectIf = RedirectCondition.Unauthenticated,
    redirectTo,
    children,
  }: PropsWithChildren<ProtectedRouteProps>): JSX.Element => {
    const rootStore = useContext(RootContext);
    const authStore = useAuthStore();
    const { loggedUser } = authStore;

    const doRedirect =
      (redirectIf === RedirectCondition.Unauthenticated && !loggedUser) ||
      (redirectIf === RedirectCondition.NonAdmin &&
        loggedUser?.isAdmin === false) ||
      (redirectIf === RedirectCondition.Authenticated && !!loggedUser);

    const defaultRedirect =
      redirectIf === RedirectCondition.Authenticated ? '/meetups' : '/login';

    const redirectTarget = redirectTo ?? defaultRedirect;

    useEffect((): void => {
      if (doRedirect) {
        switch (redirectIf) {
          case RedirectCondition.Unauthenticated:
            const notAuthenticatedError = new NotAuthenticatedError();
            rootStore?.onAlert({
              severity: AlertSeverity.Error,
              title: notAuthenticatedError.problem,
              text: notAuthenticatedError.hint,
            });
            break;
          case RedirectCondition.NonAdmin:
            const notAuthorizedError = new NotAuthorizedError();
            rootStore?.onAlert({
              severity: AlertSeverity.Error,
              title: notAuthorizedError.problem,
              text: notAuthorizedError.hint,
            });
            break;
          default:
            break;
        }
      }
    }, [doRedirect, redirectIf]);

    if (!authStore.isInitialized) {
      return <LoadingSpinner />;
    }

    if (doRedirect) {
      return <Navigate to={redirectTarget} replace />;
    }

    return <>{children}</>;
  },
);
