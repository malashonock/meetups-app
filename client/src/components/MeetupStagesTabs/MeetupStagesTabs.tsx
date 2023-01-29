import React from 'react';
import classNames from 'classnames';
import { NavLink, Outlet } from 'react-router-dom';
import { i18n } from 'i18next';
import { useTranslation } from 'react-i18next';

import {
  Typography,
  NavTabs,
  MeetupTabContent,
  MeetupCardVariant,
} from 'components';

import styles from './MeetupStagesTabs.module.scss';

enum MeetupTabLink {
  Topics = 'topics',
  OnModeration = 'moderation',
  Upcoming = 'upcoming',
  Finished = 'finished',
}

export const meetupTabsLinks = Object.values(MeetupTabLink);

type MeetupTabDescriptor = {
  label: (i18nInstance: i18n) => string;
  component: React.ReactNode | JSX.Element;
};

export const meetupTabToDescriptor: Record<MeetupTabLink, MeetupTabDescriptor> =
  {
    [MeetupTabLink.Topics]: {
      label: ({ t }: i18n) =>
        t('meetupTabs.tabTitle', { context: MeetupTabLink.Topics }),
      component: <MeetupTabContent variant={MeetupCardVariant.Topic} />,
    },
    [MeetupTabLink.OnModeration]: {
      label: ({ t }: i18n) =>
        t('meetupTabs.tabTitle', { context: MeetupTabLink.OnModeration }),
      component: <MeetupTabContent variant={MeetupCardVariant.OnModeration} />,
    },
    [MeetupTabLink.Upcoming]: {
      label: ({ t }: i18n) =>
        t('meetupTabs.tabTitle', { context: MeetupTabLink.Upcoming }),
      component: <MeetupTabContent variant={MeetupCardVariant.Upcoming} />,
    },
    [MeetupTabLink.Finished]: {
      label: ({ t }: i18n) =>
        t('meetupTabs.tabTitle', { context: MeetupTabLink.Finished }),
      component: <MeetupTabContent variant={MeetupCardVariant.Finished} />,
    },
  };

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
              <Typography>{meetupTabToDescriptor[tab].label(i18n)}</Typography>
            </NavLink>
          ),
        )}
      </NavTabs>
      <Outlet />
    </>
  );
};
