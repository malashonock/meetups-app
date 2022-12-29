import React from 'react';
import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { Typography, MeetupStagesTabs } from 'components';

import styles from './MeetupPage.module.scss';

export const MeetupPage = () => {
  return (
    <div>
      <Typography
        variant="heading"
        className={classNames(styles.heading, 'fs-xl')}
      >
        Митапы
      </Typography>
      <MeetupStagesTabs />
      <Outlet />
    </div>
  );
};
