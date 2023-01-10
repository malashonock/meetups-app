import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header, meetupTabsLinks, meetupTabToDescriptor } from 'components';
import { MeetupPage, NotFoundPage, NewsPage, ViewMeetupPage } from 'pages';

import styles from './App.module.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/meetups" />} />
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
            <Route path=":id" element={<ViewMeetupPage />} />
            <Route path=":id/edit" element={<div>Edit meetup</div>} />
          </Route>
          <Route path="news">
            <Route index element={<NewsPage />} />
            <Route path="create" element={<div>Create news article</div>} />
            <Route path=":id">
              <Route index element={<div>View news article</div>} />
              <Route path="edit" element={<div>Edit news article</div>} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
