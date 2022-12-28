import React from 'react';
import classNames from 'classnames';

import {
  Typography,
  MeetupStagesTabs,
  TabsManager,
  Tabs,
  Tab,
  TabPanel,
} from 'components';

import styles from './MeetupPage.module.scss';

export const MeetupPage = () => {
  return (
    <div>
      <Typography
        variant="heading"
        className={classNames(styles.heading, 'fs-xl')}
      >
        Митапы
      </Typography>
      <TabsManager>
        <Tabs changesUrl={false}>
          <Tab value="1">1</Tab>
          <Tab value="2">2</Tab>
          <Tab value="3">3</Tab>
        </Tabs>
        <TabPanel value="1">
          <div>
            <p>1</p>
            <p>dv11ds</p>
            <button>dfds</button>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div>
            <p>2</p>
            <p>dvd22s</p>
            <button>dfds</button>
          </div>
        </TabPanel>
        <TabPanel value="3">
          <div>
            <p>3</p>
            <p>dvd22s</p>
            <button>dfds</button>
          </div>
        </TabPanel>
      </TabsManager>
      {/* <MeetupStagesTabs /> */}
    </div>
  );
};
