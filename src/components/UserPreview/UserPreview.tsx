import { useMemo } from 'react';

import { getFirstLetter } from 'helpers';
import { Typography } from 'components';

import styles from './UserPreview.module.scss';
import { ShortUser } from 'model';
import classNames from 'classnames';

type UserPreviewVariant = 'header' | 'default';

interface UserPreviewProps {
  user: ShortUser;
  variant?: UserPreviewVariant;
}

export const UserPreview = ({
  user,
  variant = 'default',
}: UserPreviewProps): JSX.Element => {
  const { name, surname } = user;

  const userInitials = useMemo(() => {
    return getFirstLetter(name) + getFirstLetter(surname);
  }, [name, surname]);

  return (
    <div className={classNames(styles.user, styles[variant])}>
      <div className={styles.avatar}>
        <Typography className={styles.initials}>{userInitials}</Typography>
      </div>
      <Typography className={styles.name}>{`${name} ${surname}`}</Typography>
    </div>
  );
};
