import { ReactComponent as ProfileIcon } from './profile.svg';
import { Typography, TypographyComponent } from 'components';

import styles from './VotesCount.module.scss';

interface VotesCountProps {
  votesCount: number;
}

export const VotesCount = ({ votesCount }: VotesCountProps): JSX.Element => (
  <div className={styles.wrapper}>
    <ProfileIcon className={styles.icon} />
    <Typography
      component={TypographyComponent.Paragraph}
      className={styles.text}
    >
      {votesCount} поддерживают
    </Typography>
  </div>
);
