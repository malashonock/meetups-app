import classNames from 'classnames';

import { getFirstLetter } from 'helpers';
import { Typography } from 'components';
import { ShortUser } from 'model';

import styles from './UserPreview.module.scss';

export enum UserPreviewVariant {
  Header = 'header',
  Default = 'default',
}

interface UserPreviewProps {
  user: ShortUser;
  variant?: UserPreviewVariant;
}

export const UserPreview = ({
  user,
  variant = UserPreviewVariant.Default,
}: UserPreviewProps): JSX.Element => {
  const { name, surname } = user;

  const userInitials = getFirstLetter(name) + getFirstLetter(surname);

  return (
    <div className={classNames(styles.user, styles[variant])}>
      <div className={styles.avatar}>
        <Typography className={styles.initials}>{userInitials}</Typography>
      </div>
      <Typography className={styles.name}>{`${name} ${surname}`}</Typography>
    </div>
  );
};
