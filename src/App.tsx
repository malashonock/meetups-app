import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header, meetupTabsLinks, meetupTabToDescriptor } from 'components';
import { MeetupPage, NotFoundPage } from 'pages';

import styles from './App.module.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/meetups" />} />
          <Route path="meetups" element={<MeetupPage />}>
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
          <Route path="news" element={<div>News</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
