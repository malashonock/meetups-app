import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header, meetupTabs, meetupTabToDescriptor } from 'components';
import { MeetupPage } from 'pages';

import styles from './App.module.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className={styles['app-container']}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/meetups" />} />
          <Route path="meetups" element={<MeetupPage />}>
            <Route
              index
              element={
                <Navigate
                  replace
                  to={meetupTabToDescriptor[meetupTabs[0]].link}
                />
              }
            ></Route>
            {meetupTabs.map((tab) => (
              <Route
                path={meetupTabToDescriptor[tab].link}
                element={meetupTabToDescriptor[tab].component}
              ></Route>
            ))}
          </Route>
          <Route path="news" element={<div>News</div>} />
          <Route path="*" element={<div>404 | Page Not Found</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
