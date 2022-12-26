import React from 'react';
import classNames from 'classnames';
import { NavLink, Outlet } from 'react-router-dom';

import { RenderTabCallback, Tabs, Typography } from 'components';

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
  const renderMeetupTab: RenderTabCallback<MeetupTabLink> = ({
    tab,
    onSetActiveTab,
  }) => (
    <NavLink
      key={tab}
      to={tab}
      className={({ isActive }) =>
        classNames(styles.tab, {
          [styles.active]: isActive,
        })
      }
      onClick={onSetActiveTab}
    >
      <Typography>{meetupTabToDescriptor[tab].label}</Typography>
    </NavLink>
  );

  return (
    <Tabs tabs={meetupTabsLinks} renderTab={renderMeetupTab} usesUrl>
      <Outlet />
    </Tabs>
  );
}
