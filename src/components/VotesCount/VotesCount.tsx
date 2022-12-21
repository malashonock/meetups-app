import { ReactComponent as ProfileIcon } from './profile.svg';
import { Typography } from 'components';
import styles from './VotesCount.module.scss';

interface VotesCountProps {
  votesCount: number;
}

export const VotesCount = ({ votesCount }: VotesCountProps): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <ProfileIcon className={styles.icon} />
      <Typography variant="paragraph" className={styles.text}>
        {votesCount} поддерживают
      </Typography>
    </div>
  );
};
