import { MouseEvent } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

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
import { Meetup } from 'stores';
import { useAuthStore, useConfirmDialog, useLocale } from 'hooks';

import styles from './MeetupCard.module.scss';

interface MeetupCardProps {
  meetup: Meetup;
}

export enum MeetupCardVariant {
  Topic = 'topic',
  Draft = 'draft',
  Upcoming = 'upcoming',
  Finished = 'finished',
}

export const MeetupCard = observer(
  ({ meetup }: MeetupCardProps): JSX.Element => {
    const { status, author, start, place, subject, excerpt, votedUsers, id } =
      meetup;

    const { loggedUser } = useAuthStore();
    const [locale] = useLocale();
    const { i18n, t } = useTranslation();
    const confirm = useConfirmDialog();

    const navigate = useNavigate();

    const handleEditMeetup = (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      navigate(`/meetups/${id}/edit`);
    };

    const handleDeleteMeetup = async (
      event: MouseEvent<HTMLButtonElement>,
    ): Promise<void> => {
      event.preventDefault();

      const deleteConfirmed = await confirm({
        prompt: t('meetupCard.deletePrompt') || '',
        confirmBtnLabel: t('formButtons.delete') || 'Delete',
      });

      if (deleteConfirmed) {
        await meetup.delete();
      }
    };

    let formattedWeekdayShort: string | undefined;
    let formattedDate: string | undefined;
    let formattedTime: string | undefined;

    if (start) {
      ({ formattedWeekdayShort, formattedDate, formattedTime } = parseDate(
        start,
        { locale, i18n },
      ));
    }

    const votesCount = votedUsers.length;

    const getVariant = (): MeetupCardVariant => {
      switch (status) {
        case MeetupStatus.REQUEST:
        default:
          return MeetupCardVariant.Topic;
        case MeetupStatus.DRAFT:
          return MeetupCardVariant.Draft;
        case MeetupStatus.CONFIRMED:
          return start && isPast(start)
            ? MeetupCardVariant.Finished
            : MeetupCardVariant.Upcoming;
      }
    };

    return (
      <article
        className={classNames(styles.card, styles[getVariant()])}
        data-testid="meetup-card"
      >
        <header className={styles.header}>
          {status === MeetupStatus.REQUEST ? (
            <UserPreview user={author} variant={UserPreviewVariant.Card} />
          ) : (
            <ul className={styles.appointment}>
              {start !== undefined ? (
                <>
                  <li className={styles.appointmentItem} key="date">
                    <Typography className={styles.date} noWrap>
                      {`${formattedWeekdayShort}, ${formattedDate}`}
                    </Typography>
                  </li>
                  <li className={styles.appointmentItem} key="time">
                    <Typography className={styles.time} noWrap>
                      {formattedTime}
                    </Typography>
                  </li>
                </>
              ) : (
                '—'
              )}
              {place !== undefined && (
                <li className={styles.appointmentItem} key="location">
                  <Typography className={styles.location} noWrap>
                    {place}
                  </Typography>
                </li>
              )}
            </ul>
          )}
          {loggedUser?.isAdmin ? (
            <div className={styles.controls}>
              <DeleteButton onClick={handleDeleteMeetup} />
              {status !== MeetupStatus.REQUEST && (
                <EditButton onClick={handleEditMeetup} />
              )}
            </div>
          ) : null}
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
            votesCount > 0 && <VotesCount votesCount={votesCount} />
          ) : (
            <UserPreview user={author} variant={UserPreviewVariant.Card} />
          )}
        </footer>
      </article>
    );
  },
);
