import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { Typography } from 'components';
import { Theme } from 'types';

import styles from './PageLink.module.scss';

interface PageLinkProps {
  url: string;
  theme: Theme;
  children: string;
}

export const PageLink = ({
  url,
  theme,
  children,
}: PageLinkProps): JSX.Element => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        classNames(styles.navLink, styles[theme], { [styles.active]: isActive })
      }
    >
      <Typography>{children}</Typography>
    </NavLink>
  );
};
