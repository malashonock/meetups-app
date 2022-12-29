import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import { Typography, NavTabs } from 'components';

import styles from './MeetupStagesTabs.module.scss';

enum MeetupTabLink {
  Topics = 'topics',
  OnModeration = 'onmoderation',
  Upcoming = 'upcoming',
  Finished = 'finished',
}

export const meetupTabsLinks = Object.values(MeetupTabLink);

type MeetupTabDescriptor = {
  label: string;
  component: React.ReactNode | JSX.Element;
};

export const meetupTabToDescriptor: Record<MeetupTabLink, MeetupTabDescriptor> =
  {
    [MeetupTabLink.Topics]: {
      label: 'Темы',
      component: <div>Tab 1 Content</div>,
    },
    [MeetupTabLink.OnModeration]: {
      label: 'На модерации',
      component: <div>Tab 2 Content</div>,
    },
    [MeetupTabLink.Upcoming]: {
      label: 'Будущие',
      component: <div>Tab 3 Content</div>,
    },
    [MeetupTabLink.Finished]: {
      label: 'Прошедшие',
      component: <div>Tab 4 Content</div>,
    },
  };

export function MeetupStagesTabs() {
  return (
    <>
      <NavTabs className={styles.tabs}>
        {meetupTabsLinks.map((tab) => (
          <NavLink
            key={tab}
            to={tab}
            className={({ isActive }) =>
              classNames(styles.tab, {
                [styles.active]: isActive,
              })
            }
          >
            <Typography>{meetupTabToDescriptor[tab].label}</Typography>
          </NavLink>
        ))}
      </NavTabs>
    </>
  );
}
