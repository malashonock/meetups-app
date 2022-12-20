import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header } from 'components';
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
            <Route index element={<Navigate replace to="t1" />}></Route>
            <Route path="t1" element={<div>t1</div>}></Route>
            <Route path="t2" element={<div>t2</div>}></Route>
            <Route path="t3" element={<div>t3</div>}></Route>
          </Route>
          <Route path="news" element={<div>News</div>} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
