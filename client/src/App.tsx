import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header, meetupTabsLinks, meetupTabToDescriptor } from 'components';

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

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/meetups" />} />
          <Route path="login" element={<LoginPage />} />
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
            <Route path="create" element={<CreateMeetupPage />} />
            <Route path=":id">
              <Route index element={<ViewMeetupPage />} />
              <Route path="edit" element={<EditMeetupPage />} />
            </Route>
          </Route>
          <Route path="news">
            <Route index element={<NewsPage />} />
            <Route path="create" element={<CreateNewsPage />} />
            <Route path=":id">
              <Route index element={<ViewNewsPage />} />
              <Route path="edit" element={<EditNewsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
