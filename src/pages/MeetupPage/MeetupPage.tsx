import React from 'react';
import { Outlet } from 'react-router-dom';

import { Typography, MeetupStagesTabs, TypographyComponent } from 'components';

import styles from './MeetupPage.module.scss';

export const MeetupPage = () => {
  return (
    <div>
      <Typography
        component={TypographyComponent.Heading1}
        className={styles.heading}
      >
        Митапы
      </Typography>
      <MeetupStagesTabs />
      <Outlet />
    </div>
  );
};
