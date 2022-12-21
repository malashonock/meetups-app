import classNames from 'classnames';
import {
  DeleteButton,
  EditButton,
  Typography,
  UserPreview,
  VotesCount,
} from 'components';
import { parseDateString } from 'helpers';
import { Meetup, MeetupStatus } from 'model';
import { useMemo } from 'react';
import styles from './MeetupCard.module.scss';

interface MeetupCardProps {
  meetup: Meetup;
}

type MeetupCardVariant = 'topic' | 'onModeration' | 'upcoming' | 'finished';

export const MeetupCard = ({ meetup }: MeetupCardProps): JSX.Element => {
  const { status, author, start, place, subject, excerpt, goCount, isOver } =
    meetup;

  let formattedWeekDay: string | undefined;
  let formattedDate: string | undefined;
  let formattedTime: string | undefined;

  if (start) {
    ({ formattedWeekDay, formattedDate, formattedTime } =
      parseDateString(start));
  }

  const variant = useMemo((): MeetupCardVariant => {
    switch (status) {
      case MeetupStatus.REQUEST:
      default:
        return 'topic';
      case MeetupStatus.DRAFT:
        return 'onModeration';
      case MeetupStatus.CONFIRMED:
        return isOver ? 'finished' : 'upcoming';
    }
  }, [status, isOver]);

  return (
    <article className={classNames(styles.card, styles[variant])}>
      <header className={styles.header}>
        {status === MeetupStatus.REQUEST ? (
          <UserPreview user={author} />
        ) : (
          <ul className={styles.appointment}>
            {start !== undefined && (
              <>
                <li className={styles.appointmentItem} key="date">
                  <Typography className={styles.date}>
                    {`${formattedWeekDay}, ${formattedDate}`}
                  </Typography>
                </li>
                <li className={styles.appointmentItem} key="time">
                  <Typography className={styles.time}>
                    {formattedTime}
                  </Typography>
                </li>
              </>
            )}
            {place !== undefined && (
              <li className={styles.appointmentItem} key="location">
                <Typography className={styles.location}>{place}</Typography>
              </li>
            )}
          </ul>
        )}
        <div className={styles.controls}>
          <DeleteButton />
          {status !== MeetupStatus.REQUEST && <EditButton />}
        </div>
      </header>

      <div className={styles.body}>
        <Typography className={styles.subject}>{subject}</Typography>
        {excerpt !== undefined && (
          <Typography className={styles.excerpt}>{excerpt}</Typography>
        )}
      </div>

      <footer className={styles.footer}>
        {status === MeetupStatus.REQUEST ? (
          goCount > 0 && <VotesCount votesCount={goCount} />
        ) : (
          <UserPreview user={author} />
        )}
      </footer>
    </article>
  );
};
