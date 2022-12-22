import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { NavLink, Outlet } from 'react-router-dom';

import { Typography } from 'components';

import styles from './Tabs.module.scss';

enum MeetupTab {
  Topics = 'Темы',
  Moderating = 'На модерации',
  Upcoming = 'Будущие',
  Finished = 'Прошедшие',
}

export const meetupTabs = Object.values(MeetupTab);

type MeetupTabDescriptor = {
  link: string;
  component: React.ReactNode | JSX.Element;
};

export const meetupTabToDescriptor: Record<MeetupTab, MeetupTabDescriptor> = {
  [MeetupTab.Topics]: {
    link: 'topics',
    component: <div>Tab 1 Content</div>,
  },
  [MeetupTab.Moderating]: {
    link: 'moderating',
    component: <div>Tab 2 Content</div>,
  },
  [MeetupTab.Upcoming]: {
    link: 'upcoming',
    component: <div>Tab 3 Content</div>,
  },
  [MeetupTab.Finished]: {
    link: 'finished',
    component: <div>Tab 4 Content</div>,
  },
};

export const Tabs = () => {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.width = `calc(100%/${meetupTabs.length})`;
    }
  }, []);

  const setIndicatorStyle = (index: number) => {
    if (indicatorRef.current) {
      indicatorRef.current.style.left = `calc(calc(100%/${meetupTabs.length}) * ${index})`;
    }
  };

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? classNames(styles.tab, styles.active) : styles.tab;

  return (
    <>
      <div className={styles.tabs}>
        {meetupTabs.map((tab, index) => (
          <NavLink
            key={tab}
            to={meetupTabToDescriptor[tab].link}
            className={getLinkClassName}
            onClick={() => setIndicatorStyle(index)}
          >
            <Typography>{tab}</Typography>
          </NavLink>
        ))}
      </div>
      <div className={styles['tab-indicator']} ref={indicatorRef}></div>
      <Outlet />
    </>
  );
};
