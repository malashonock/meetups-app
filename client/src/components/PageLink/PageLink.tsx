import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { Typography } from 'components';
import { Theme } from 'types';

import styles from './PageLink.module.scss';

interface PageLinkProps {
  url: string;
  theme: Theme;
  children: string;
  onFollowLink?: () => void;
}

export const PageLink = ({
  url,
  theme,
  children,
  onFollowLink,
}: PageLinkProps): JSX.Element => {
  return (
    <NavLink
      to={url}
      onClick={onFollowLink}
      className={({ isActive }) =>
        classNames(styles.navLink, styles[theme], { [styles.active]: isActive })
      }
    >
      <Typography>{children}</Typography>
    </NavLink>
  );
};
