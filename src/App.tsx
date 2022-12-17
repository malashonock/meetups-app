import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import styles from './App.module.scss';
import { Header } from './components/';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className={styles['app-container']}>
        <Routes>
          <Route index path="/meetups" element={<div>Meetups</div>} />
          <Route path="/news" element={<div>News</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
