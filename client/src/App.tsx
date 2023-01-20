import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header, meetupTabsLinks, meetupTabToDescriptor } from 'components';
import { LoginPage, MeetupPage, NotFoundPage, NewsPage, ViewMeetupPage, ViewNewsPage, CreateNewsPage } from 'pages';

import styles from './App.module.scss';
import { EditNewsPage } from 'pages/EditNewsPage/EditNewsPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/meetups" />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="meetups">
            <Route element={<MeetupPage />}>
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
            <Route path="create" element={<div>Create meetup page</div>} />
            <Route path=":id">
              <Route index element={<ViewMeetupPage />} />
              <Route path="edit" element={<div>Edit meetup</div>} />
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
