import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import {
  Header,
  meetupTabsLinks,
  meetupTabToDescriptor,
  ProtectedRoute,
  RootStoreProvider,
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
import { Suspense } from 'react';

export const App = (): JSX.Element => (
  <RootStoreProvider>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <main className={styles.container}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/meetups" />} />
            <Route
              path="login"
              element={
                <ProtectedRoute redirectIf="authenticated">
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
                    element={meetupTabToDescriptor[tabLink].component}
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
                    <ProtectedRoute>
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
                    <ProtectedRoute>
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
  </RootStoreProvider>
);
