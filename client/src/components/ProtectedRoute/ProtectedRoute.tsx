import { useAuthStore } from 'hooks';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectIf?: 'authenticated' | 'unauthenticated';
  redirectTo?: string;
}

export const ProtectedRoute = ({
  redirectIf = 'unauthenticated',
  redirectTo,
  children,
}: PropsWithChildren<ProtectedRouteProps>): JSX.Element => {
  const { loggedUser } = useAuthStore();

  const doRedirect =
    (!loggedUser && redirectIf === 'unauthenticated') ||
    (loggedUser && redirectIf === 'authenticated');

  const defaultRedirect =
    redirectIf === 'unauthenticated' ? '/login' : '/meetups';

  const redirectTarget = redirectTo ?? defaultRedirect;

  if (doRedirect) {
    return <Navigate to={redirectTarget} replace />;
  }

  return <>{children}</>;
};
