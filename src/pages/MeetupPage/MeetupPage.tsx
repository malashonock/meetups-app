import React from 'react';

import { Typography, Tabs } from 'components';

import styles from './MeetupPage.module.scss';
import classNames from 'classnames';

export const MeetupPage = () => {
  return (
    <div>
      <Typography
        variant="heading"
        className={classNames(styles.heading, 'fs-xl')}
      >
        Митапы
      </Typography>
      <Tabs />
    </div>
  );
};
