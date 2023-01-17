import classNames from 'classnames';
import { useNavigate } from 'react-router';

import {
  DeleteButton,
  EditButton,
  Typography,
  TypographyComponent,
  UserPreview,
  UserPreviewVariant,
  VotesCount,
} from 'components';
import { isPast, parseDateString } from 'helpers';
import { Meetup, MeetupStatus } from 'model';

import styles from './MeetupCard.module.scss';

interface MeetupCardProps {
  meetup: Meetup;
}

export enum MeetupCardVariant {
  Topic = 'topic',
  OnModeration = 'onModeration',
  Upcoming = 'upcoming',
  Finished = 'finished',
}

export const MeetupCard = ({ meetup }: MeetupCardProps): JSX.Element => {
  const {
    status,
    author,
    start,
    place,
    subject,
    excerpt,
    goCount,
    id,
  } = meetup;

  const navigate = useNavigate();

  const openEditMeetupPage = () => navigate(`/meetups/${id}/edit`);

  let formattedWeekdayShort: string | undefined;
  let formattedDate: string | undefined;
  let formattedTime: string | undefined;

  if (start) {
    ({ formattedWeekdayShort, formattedDate, formattedTime } =
      parseDateString(start));
  }

  const getVariant = (): MeetupCardVariant => {
    switch (status) {
      case MeetupStatus.DRAFT:
      default:
        return MeetupCardVariant.Topic;
      case MeetupStatus.REQUEST:
        return MeetupCardVariant.OnModeration;
      case MeetupStatus.CONFIRMED:
        return start && isPast(start) ? MeetupCardVariant.Finished : MeetupCardVariant.Upcoming;
    }
  };

  const variant = getVariant();

  return (
    <article className={classNames(styles.card, styles[variant])}>
      <header className={styles.header}>
        {status === MeetupStatus.DRAFT ? (
          <UserPreview user={author} variant={UserPreviewVariant.Card} />
        ) : (
          <ul className={styles.appointment}>
            {start !== undefined ? (
              <>
                <li className={styles.appointmentItem} key="date">
                  <Typography className={styles.date}>
                    {`${formattedWeekdayShort}, ${formattedDate}`}
                  </Typography>
                </li>
                <li className={styles.appointmentItem} key="time">
                  <Typography className={styles.time}>
                    {formattedTime}
                  </Typography>
                </li>
              </>
            ) : (
              '—'
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
          {status !== MeetupStatus.DRAFT && (
            <EditButton
              onClick={(e) => {
                e.preventDefault();
                openEditMeetupPage();
              }}
            />
          )}
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
        {status === MeetupStatus.DRAFT ? (
          goCount > 0 && <VotesCount votesCount={goCount} />
        ) : (
          <UserPreview user={author} variant={UserPreviewVariant.Card} />
        )}
      </footer>
    </article>
  );
};
