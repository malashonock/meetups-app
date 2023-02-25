import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  AvatarGroup,
  Button,
  ButtonVariant,
  Typography,
  TypographyComponent,
  UserPreview,
} from 'components';
import { MeetupStatus } from 'model';
import { isPast, parseDate } from 'utils';
import { NotFoundPage } from 'pages';
import { User } from 'stores';
import { useAuthStore, useMeetup, useLocale, useUserStore } from 'hooks';
import { Optional } from 'types';

import styles from './ViewMeetupPage.module.scss';
import defaultImage from 'assets/images/default-image.jpg';
import calendar from './assets/calendar.svg';
import clock from './assets/clock.svg';
import pin from './assets/pin.svg';

export const ViewMeetupPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const meetup = useMeetup(id);
  const { userStore } = useUserStore();
  const { i18n, t } = useTranslation();
  const [locale] = useLocale();
  const { loggedUser } = useAuthStore();

  if (!meetup) {
    return <NotFoundPage />;
  }

  const {
    start,
    finish,
    place,
    status,
    subject,
    excerpt,
    author: authorData,
    votedUsers: votedUsersData,
    speakers: speakersData,
    image,
  } = meetup;

  const author: Optional<User> = userStore?.findUser(authorData);
  const speakers = userStore?.findUsers(speakersData);
  const votedUsers = userStore?.findUsers(votedUsersData);

  const handleBack = (): void => navigate(-1);

  const handleDeleteTopic = async (): Promise<void> => {
    if (
      !window.confirm(
        t('viewMeetupPage.deleteTopicPrompt') ||
          'Are you sure you want to delete the topic?',
      )
    ) {
      return;
    }

    await meetup?.delete();
    navigate(`/meetups/topics`);
  };

  const handleApproveTopic = async (): Promise<void> => {
    await meetup?.approve();
    navigate(`/meetups/${id}/edit`);
  };

  const canPublish = meetup?.start && meetup?.finish && meetup?.place;

  const handlePublishMeetup = async (): Promise<void> => {
    await meetup?.publish();

    const tab = start && isPast(start) ? 'finished' : 'upcoming';

    navigate(`/meetups/${tab}`);
  };

  const renderHeader = () => {
    if (status === MeetupStatus.REQUEST) {
      return (
        <div className={styles.data}>
          <Typography
            component={TypographyComponent.Span}
            className={styles.dataName}
          >
            {t('viewMeetupPage.topic')}
          </Typography>
          <div className={styles.dataContent}>
            <Typography
              className={styles.meetupHeading}
              component={TypographyComponent.Heading2}
            >
              {subject}
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.headerData}>
        <figure className={styles.imageWrapper}>
          <img
            className={styles.image}
            src={image?.url ?? defaultImage}
            alt={t('viewMeetupPage.imgAlt') || 'Meetup image'}
          />
        </figure>
        <div className={styles.headerDataContent}>
          <Typography
            className={styles.meetupHeading}
            component={TypographyComponent.Heading2}
          >
            {subject}
          </Typography>
        </div>
      </div>
    );
  };

  const renderTimePlace = () => {
    if (status === MeetupStatus.REQUEST) {
      return null;
    }

    let date, time;

    if (start) {
      const { formattedWeekdayLong, formattedDate, formattedTime } = parseDate(
        start,
        { locale, i18n },
      );

      date = `${formattedWeekdayLong}, ${formattedDate}, ${start.getFullYear()}`;
      time = `${formattedTime}`;

      if (finish) {
        const { formattedTime } = parseDate(finish, { locale, i18n });

        time = time + ` — ${formattedTime}`;
      }
    }

    return (
      <div className={styles.data}>
        <Typography
          component={TypographyComponent.Span}
          className={classNames(styles.dataName, {
            [styles.notFilledText]: !canPublish,
          })}
        >
          {canPublish
            ? t('viewMeetupPage.timePlaceInfo.valid')
            : t('viewMeetupPage.timePlaceInfo.invalid')}
        </Typography>
        <div
          className={classNames(styles.dataContent, styles.timePlaceInfo, {
            [styles.notFilledOutline]: !canPublish,
          })}
        >
          <div className={styles.info}>
            <img
              className={styles.image}
              src={calendar}
              alt={t('viewMeetupPage.date') || 'Date'}
            />
            <Typography component={TypographyComponent.Span}>
              {date || '—'}
            </Typography>
          </div>
          <div className={styles.info}>
            <img
              className={styles.image}
              src={clock}
              alt={t('viewMeetupPage.time') || 'Time'}
            />
            <Typography component={TypographyComponent.Span}>
              {time || '—'}
            </Typography>
          </div>
          <div className={styles.info}>
            <img
              className={styles.image}
              src={pin}
              alt={t('viewMeetupPage.location') || 'Location'}
            />
            <Typography component={TypographyComponent.Span}>
              {place || '—'}
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  const renderAuthor = () => (
    <div className={styles.data}>
      <Typography
        component={TypographyComponent.Span}
        className={styles.dataName}
      >
        {status === MeetupStatus.REQUEST
          ? t('viewMeetupPage.author')
          : t('viewMeetupPage.speakers')}
      </Typography>
      <div className={styles.dataContent}>
        {status === MeetupStatus.REQUEST ? (
          author !== undefined && <UserPreview user={author} />
        ) : (
          <div className={styles.speakerWrapper}>
            {speakers?.map((speaker) => (
              <UserPreview key={speaker.id} user={speaker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderVotedUsers = () => {
    if (votedUsers?.length === 0) {
      return null;
    }

    return (
      <div className={styles.data}>
        <Typography
          component={TypographyComponent.Span}
          className={styles.dataName}
        >
          {t('viewMeetupPage.supporters')}
        </Typography>
        <div className={styles.dataContent}>
          <AvatarGroup users={votedUsers ?? []} />
        </div>
      </div>
    );
  };

  const renderActions = () => {
    return (
      <div className={classNames(styles.dataContent, styles.actions)}>
        <Button
          className={classNames(styles.actionButton, styles.backBtn)}
          variant={ButtonVariant.Default}
          onClick={handleBack}
        >
          {t('formButtons.back')}
        </Button>
        {loggedUser ? (
          <div className={styles.actionsWrapper}>
            {status === MeetupStatus.REQUEST && (
              <>
                <Button
                  className={classNames(styles.actionButton, styles.deleteBtn)}
                  variant={ButtonVariant.Secondary}
                  onClick={handleDeleteTopic}
                >
                  {t('formButtons.delete')}
                </Button>
                <Button
                  className={classNames(styles.actionButton, styles.approveBtn)}
                  variant={ButtonVariant.Primary}
                  onClick={handleApproveTopic}
                >
                  {t('viewMeetupPage.approveTopicBtn')}
                </Button>
              </>
            )}
            {status === MeetupStatus.DRAFT && (
              <Button
                className={classNames(styles.actionButton, styles.publishBtn)}
                variant={ButtonVariant.Primary}
                onClick={handlePublishMeetup}
                disabled={!canPublish}
              >
                {t('formButtons.publish')}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section className={classNames(styles.container, styles[status])}>
      <Typography
        className={styles.heading}
        component={TypographyComponent.Heading1}
      >
        {t('viewMeetupPage.title', { context: status })}
      </Typography>
      <div className={styles.dataWrapper}>
        {renderHeader()}
        {renderTimePlace()}
        {renderAuthor()}
        <div className={styles.data}>
          <Typography
            component={TypographyComponent.Span}
            className={styles.dataName}
          >
            {t('viewMeetupPage.description')}
          </Typography>
          <div className={styles.dataContent}>
            <Typography
              component={TypographyComponent.Paragraph}
              className={styles.excerpt}
            >
              {excerpt}
            </Typography>
          </div>
        </div>
        {renderVotedUsers()}
        {renderActions()}
      </div>
    </section>
  );
});
