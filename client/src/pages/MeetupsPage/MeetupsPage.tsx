import { useTranslation } from 'react-i18next';

import { Typography, MeetupStagesTabs, TypographyComponent } from 'components';

import styles from './MeetupsPage.module.scss';

export const MeetupsPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Typography
        component={TypographyComponent.Heading1}
        className={styles.heading}
      >
        {t('meetups')}
      </Typography>
      <MeetupStagesTabs />
    </div>
  );
};
