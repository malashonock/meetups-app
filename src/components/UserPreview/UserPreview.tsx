import React, { useMemo } from 'react';

import { getInitials } from 'helpers/getInitials';
import { Typography } from 'components';

import styles from './UserPreview.module.scss';

interface UserPreviewProps {
  name?: string;
}

export const UserPreview = ({
  name = 'Guest',
}: UserPreviewProps): JSX.Element => {
  const userInitials = useMemo(() => getInitials(name), [name]);

  return (
    <div className={styles.user}>
      <Typography variant="nav">{name}</Typography>
      <div className={styles['user-photo']}>
        <Typography variant="nav">{userInitials}</Typography>
      </div>
    </div>
  );
};
