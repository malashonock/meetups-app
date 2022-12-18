import React, { useMemo } from 'react';

import { getInitials } from 'helpers/getInitials';

import styles from './UserPreview.module.scss';

interface UserPreviewProps {
  name: string;
}

export const UserPreview = ({ name }: UserPreviewProps): JSX.Element => {
  const userInitials = useMemo(() => getInitials(name), [name]);

  return (
    <div className={styles.user}>
      <span className={styles['user-name']}>{name}</span>
      <div className={styles['user-photo']}>{userInitials}</div>
    </div>
  );
};
