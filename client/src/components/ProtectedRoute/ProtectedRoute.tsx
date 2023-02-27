import { useAuthStore } from 'hooks';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export enum RedirectCondition {
  Authenticated = 'authenticated',
  NonAdmin = 'nonAdmin',
  Unauthenticated = 'unauthenticated',
}

interface ProtectedRouteProps {
  redirectIf?: RedirectCondition;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  redirectIf = RedirectCondition.Unauthenticated,
  redirectTo,
  children,
}: PropsWithChildren<ProtectedRouteProps>): JSX.Element => {
  const { loggedUser } = useAuthStore();

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
};
