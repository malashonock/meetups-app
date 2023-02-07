import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { User } from 'stores';
import { Typography } from 'components';

import styles from './UserPreview.module.scss';

export enum UserPreviewVariant {
  Default = 'default',
  Card = 'card',
  Header = 'header',
  Image = 'image',
}

interface UserPreviewProps {
  user: User;
  variant?: UserPreviewVariant;
}

export const UserPreview = ({
  user,
  variant = UserPreviewVariant.Default,
}: UserPreviewProps): JSX.Element => {
  const { initials, fullName } = user;

  return (
    <div className={classNames(styles.user, styles[variant])}>
      <div className={styles.avatar}>
        <Typography className={styles.initials}>{initials}</Typography>
      </div>
      {variant !== UserPreviewVariant.Image && (
        <Typography className={styles.name} noWrap>
          {fullName}
        </Typography>
      )}
    </div>
  );
};
