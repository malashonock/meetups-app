import { Typography, MeetupStagesTabs, TypographyComponent } from 'components';

import styles from './MeetupsPage.module.scss';

export const MeetupsPage = () => {
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
