import { MouseEvent } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';

import {
  DeleteButton,
  EditButton,
  Typography,
  TypographyComponent,
  UserPreview,
  UserPreviewVariant,
  VotesCount,
} from 'components';
import { isPast, parseDate } from 'utils';
import { MeetupStatus } from 'model';
import { Meetup, User } from 'stores';
import { useUserStore } from 'hooks';
import { Optional } from 'types';

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

export const MeetupCard = observer(
  ({ meetup }: MeetupCardProps): JSX.Element => {
    const {
      status,
      author: authorData,
      start,
      place,
      subject,
      excerpt,
      votedUsers,
      id,
    } = meetup;

    const { userStore } = useUserStore();
    const author: Optional<User> = userStore?.findUser(authorData);

    const navigate = useNavigate();

    const handleEditMeetup = (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      navigate(`/meetups/${id}/edit`);
    };

    const handleDeleteMeetup = async (
      event: MouseEvent<HTMLButtonElement>,
    ): Promise<void> => {
      event.preventDefault();

      if (!window.confirm('Вы уверены, что хотите удалить митап?')) {
        return;
      }

      await meetup?.delete();
    };

    let formattedWeekdayShort: string | undefined;
    let formattedDate: string | undefined;
    let formattedTime: string | undefined;

    if (start) {
      ({ formattedWeekdayShort, formattedDate, formattedTime } =
        parseDate(start));
    }

    const votesCount = votedUsers.length;

    const getVariant = (): MeetupCardVariant => {
      switch (status) {
        case MeetupStatus.REQUEST:
        default:
          return MeetupCardVariant.Topic;
        case MeetupStatus.DRAFT:
          return MeetupCardVariant.OnModeration;
        case MeetupStatus.CONFIRMED:
          return start && isPast(start)
            ? MeetupCardVariant.Finished
            : MeetupCardVariant.Upcoming;
      }
    };

    return (
      <article className={classNames(styles.card, styles[getVariant()])}>
        <header className={styles.header}>
          {status === MeetupStatus.REQUEST ? (
            author !== undefined && (
              <UserPreview user={author} variant={UserPreviewVariant.Card} />
            )
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
            <DeleteButton onClick={handleDeleteMeetup} />
            {status !== MeetupStatus.REQUEST && (
              <EditButton onClick={handleEditMeetup} />
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
          {status === MeetupStatus.REQUEST
            ? votesCount > 0 && <VotesCount votesCount={votesCount} />
            : author !== undefined && (
                <UserPreview user={author} variant={UserPreviewVariant.Card} />
              )}
        </footer>
      </article>
    );
  },
);
