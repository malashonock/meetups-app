import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { LoadingSpinner } from 'components';
import { useAuthStore } from 'hooks';

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
    const { isInitialized, loggedUser } = useAuthStore();

    if (!isInitialized) {
      return <LoadingSpinner />;
    }

    const doRedirect =
      (redirectIf === RedirectCondition.Unauthenticated && !loggedUser) ||
      (redirectIf === RedirectCondition.NonAdmin && !loggedUser?.isAdmin) ||
      (redirectIf === RedirectCondition.Authenticated && loggedUser);

    const defaultRedirect =
      redirectIf === RedirectCondition.Authenticated ? '/meetups' : '/login';

    const redirectTarget = redirectTo ?? defaultRedirect;

    if (doRedirect) {
      return <Navigate to={redirectTarget} replace />;
    }

    return <>{children}</>;
  },
);
