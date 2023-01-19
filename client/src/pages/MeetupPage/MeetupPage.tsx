import { Typography, MeetupStagesTabs, TypographyComponent } from 'components';

import styles from './MeetupPage.module.scss';

export const MeetupPage = () => {
  return (
    <div className={styles.container}>
      <Typography
        component={TypographyComponent.Heading1}
        className={styles.heading}
      >
        Митапы
      </Typography>
      <MeetupStagesTabs />
    </div>
  );
};
