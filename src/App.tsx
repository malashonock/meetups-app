import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Header } from './components/';

import styles from './App.module.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className={styles['app-container']}>
        <Routes>
          <Route index path="/meetups" element={<div>Meetups</div>} />
          <Route path="/news" element={<div>News</div>} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
