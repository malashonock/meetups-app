import classNames from 'classnames';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Typography, NavTabs, meetupTabsMapper } from 'components';

import styles from './MeetupStagesTabs.module.scss';

export enum MeetupTabLink {
  Topics = 'topics',
  OnModeration = 'moderation',
  Upcoming = 'upcoming',
  Finished = 'finished',
}

export const meetupTabsLinks = Object.values(MeetupTabLink);

export const MeetupStagesTabs = (): JSX.Element => {
  const { i18n } = useTranslation();

  return (
    <>
      <NavTabs className={styles.tabs}>
        {meetupTabsLinks.map(
          (tab: MeetupTabLink): JSX.Element => (
            <NavLink
              key={tab}
              to={tab}
              className={({ isActive }) =>
                classNames(styles.tab, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>{meetupTabsMapper[tab].label(i18n)}</Typography>
            </NavLink>
          ),
        )}
      </NavTabs>
      <Outlet />
    </>
  );
};
