import { useTranslation } from 'react-i18next';

import { ReactComponent as ProfileIcon } from './profile.svg';
import { Typography, TypographyComponent } from 'components';

import styles from './VotesCount.module.scss';

interface VotesCountProps {
  votesCount: number;
}

export const VotesCount = ({ votesCount }: VotesCountProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <ProfileIcon className={styles.icon} />
      <Typography
        component={TypographyComponent.Paragraph}
        className={styles.text}
      >
        {t('votesCount.text', { count: votesCount })}
      </Typography>
    </div>
  );
};
