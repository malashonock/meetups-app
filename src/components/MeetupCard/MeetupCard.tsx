import classNames from 'classnames';

import {
  DeleteButton,
  EditButton,
  Typography,
  TypographyComponent,
  UserPreview,
  VotesCount,
} from 'components';
import { parseDateString } from 'helpers';
import { Meetup, MeetupStatus } from 'model';

import styles from './MeetupCard.module.scss';

interface MeetupCardProps {
  meetup: Meetup;
}

enum MeetupCardVariant {
  Topic = 'topic',
  OnModeration = 'onModeration',
  Upcoming = 'upcoming',
  Finished = 'finished',
}

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

  const getVariant = (): MeetupCardVariant => {
    switch (status) {
      case MeetupStatus.REQUEST:
      default:
        return MeetupCardVariant.Topic;
      case MeetupStatus.DRAFT:
        return MeetupCardVariant.OnModeration;
      case MeetupStatus.CONFIRMED:
        return isOver ? MeetupCardVariant.Finished : MeetupCardVariant.Upcoming;
    }
  };

  const variant = getVariant();

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
        <Typography
          component={TypographyComponent.Heading2}
          className={styles.subject}
        >
          {subject}
        </Typography>
        {excerpt !== undefined && (
          <Typography
            component={TypographyComponent.Paragraph}
            className={styles.excerpt}
          >
            {excerpt}
          </Typography>
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
