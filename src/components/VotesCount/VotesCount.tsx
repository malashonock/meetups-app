import { ReactComponent as ProfileIcon } from './profile.svg';
import { Typography, TypographySelector } from 'components';

import styles from './VotesCount.module.scss';

interface VotesCountProps {
  votesCount: number;
}

export const VotesCount = ({ votesCount }: VotesCountProps): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <ProfileIcon className={styles.icon} />
      <Typography
        variant={TypographySelector.Paragraph}
        className={styles.text}
      >
        {votesCount} поддерживают
      </Typography>
    </div>
  );
};
