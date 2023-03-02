import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import {
  RedirectCondition,
  Header,
  LoadingSpinner,
  meetupTabsLinks,
  meetupTabsMapper,
  ProtectedRoute,
  RootStoreProvider,
  AlertStack,
  ConfirmDialogProvider,
} from 'components';
import {
  LoginPage,
  MeetupsPage,
  NotFoundPage,
  NewsPage,
  ViewMeetupPage,
  ViewNewsPage,
  CreateNewsPage,
  CreateMeetupPage,
  EditNewsPage,
  EditMeetupPage,
} from 'pages';

import styles from './App.module.scss';

export const App = observer(
  (): JSX.Element => (
    <RootStoreProvider>
      <ConfirmDialogProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Header />
            <main className={styles.container}>
              <Routes>
                <Route path="/" element={<Navigate replace to="/meetups" />} />
                <Route
                  path="login"
                  element={
                    <ProtectedRoute
                      redirectIf={RedirectCondition.Authenticated}
                    >
                      <LoginPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="meetups">
                  <Route element={<MeetupsPage />}>
                    <Route
                      index
                      element={<Navigate replace to={meetupTabsLinks[0]} />}
                    />
                    {meetupTabsLinks.map((tabLink) => (
                      <Route
                        key={tabLink}
                        path={tabLink}
                        element={meetupTabsMapper[tabLink].component}
                      />
                    ))}
                  </Route>
                  <Route
                    path="create"
                    element={
                      <ProtectedRoute>
                        <CreateMeetupPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path=":id">
                    <Route index element={<ViewMeetupPage />} />
                    <Route
                      path="edit"
                      element={
                        <ProtectedRoute redirectIf={RedirectCondition.NonAdmin}>
                          <EditMeetupPage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Route>
                <Route path="news">
                  <Route index element={<NewsPage />} />
                  <Route
                    path="create"
                    element={
                      <ProtectedRoute>
                        <CreateNewsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path=":id">
                    <Route index element={<ViewNewsPage />} />
                    <Route
                      path="edit"
                      element={
                        <ProtectedRoute redirectIf={RedirectCondition.NonAdmin}>
                          <EditNewsPage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </Suspense>
        </BrowserRouter>
        <AlertStack />
      </ConfirmDialogProvider>
    </RootStoreProvider>
  ),
);
