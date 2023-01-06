import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Header } from 'components';
import { NotFoundPage } from 'pages';

import styles from './App.module.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/meetups" />} />
          <Route path="/meetups" element={<div>Meetups</div>} />
          <Route path="/news" element={<div>News</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
