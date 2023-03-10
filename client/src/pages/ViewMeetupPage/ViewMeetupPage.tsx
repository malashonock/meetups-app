import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  AvatarGroup,
  Button,
  ButtonVariant,
  LoadingSpinner,
  Typography,
  TypographyComponent,
  UserPreview,
} from 'components';
import { NotFoundPage } from 'pages';
import { MeetupStatus } from 'model';
import { isPast, parseDate } from 'utils';
import { useAuthStore, useMeetup, useLocale, useConfirmDialog } from 'hooks';

import styles from './ViewMeetupPage.module.scss';
import defaultImage from 'assets/images/default-image.jpg';
import calendar from './assets/calendar.svg';
import clock from './assets/clock.svg';
import pin from './assets/pin.svg';

export const ViewMeetupPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { meetup, isLoading, isInitialized, isError } = useMeetup(id);
  const { i18n, t } = useTranslation();
  const [locale] = useLocale();
  const { loggedUser } = useAuthStore();
  const confirm = useConfirmDialog();

  if (isLoading || isInitialized === false) {
    return <LoadingSpinner text={t('loadingText.meetup')} />;
  }

  if (isError) {
    return <NotFoundPage />;
  }

  if (!meetup) {
    return null;
  }

  const {
    start,
    finish,
    place,
    status,
    subject,
    excerpt,
    author,
    speakers,
    votedUsers,
    participants,
    image,
  } = meetup;

  const isFinished = meetup?.finish && isPast(meetup.finish);
  const canPublish = meetup?.start && meetup?.finish && meetup?.place;

  const handleBack = (): void => navigate(-1);

  const handleDeleteTopic = async (): Promise<void> => {
    const deleteConfirmed = await confirm({
      prompt: t('meetupCard.deletePrompt') || '',
      confirmBtnLabel: t('formButtons.delete') || 'Delete',
    });

    if (deleteConfirmed) {
      await meetup.delete();
      navigate(`/meetups/topics`);
    }
  };

  const handleApproveTopic = async (): Promise<void> => {
    await meetup?.approve();
    navigate(`/meetups/${id}/edit`);
  };

  const toggleSupportTopic = async (): Promise<void> => {
    if (!meetup?.hasLoggedUserVoted) {
      await meetup?.vote();
    } else {
      await meetup?.withdrawVote();
    }
  };

  const toggleJoinMeetup = async (): Promise<void> => {
    if (!meetup?.hasLoggedUserJoined) {
      await meetup?.join();
    } else {
      await meetup?.cancelJoin();
    }
  };

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
          <div id="date" className={styles.info}>
            <img
              className={styles.image}
              src={calendar}
              alt={t('viewMeetupPage.date') || 'Date'}
            />
            <Typography component={TypographyComponent.Span}>
              {date || '—'}
            </Typography>
          </div>
          <div id="time" className={styles.info}>
            <img
              className={styles.image}
              src={clock}
              alt={t('viewMeetupPage.time') || 'Time'}
            />
            <Typography component={TypographyComponent.Span}>
              {time || '—'}
            </Typography>
          </div>
          <div id="location" className={styles.info}>
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

  const renderSpeakers = () => {
    if (speakers.length === 0) {
      return null;
    }

    return (
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
              {speakers.length === 1 ? (
                <UserPreview user={speakers[0]} />
              ) : (
                <AvatarGroup users={speakers} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSupporters = () => {
    if (status === MeetupStatus.REQUEST) {
      return votedUsers?.length > 0 ? (
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
      ) : null;
    }

    if (status === MeetupStatus.CONFIRMED) {
      return participants?.length > 0 ? (
        <div className={styles.data}>
          <Typography
            component={TypographyComponent.Span}
            className={styles.dataName}
          >
            {t('viewMeetupPage.participants')}
          </Typography>
          <div className={styles.dataContent}>
            <AvatarGroup users={participants ?? []} />
          </div>
        </div>
      ) : null;
    }

    return null;
  };

  const renderActions = () => {
    return (
      <div className={classNames(styles.dataContent, styles.actions)}>
        <Button
          id="btn-back"
          className={classNames(styles.actionButton, styles.backBtn)}
          variant={ButtonVariant.Default}
          onClick={handleBack}
        >
          {t('formButtons.back')}
        </Button>
        {loggedUser ? (
          <div className={styles.actionsWrapper}>
            {status === MeetupStatus.REQUEST &&
              (loggedUser.isAdmin ? (
                <>
                  <Button
                    id="btn-delete"
                    className={classNames(
                      styles.actionButton,
                      styles.deleteBtn,
                    )}
                    variant={ButtonVariant.Secondary}
                    onClick={handleDeleteTopic}
                  >
                    {t('formButtons.delete')}
                  </Button>
                  <Button
                    id="btn-approve"
                    className={classNames(
                      styles.actionButton,
                      styles.approveBtn,
                    )}
                    variant={ButtonVariant.Primary}
                    onClick={handleApproveTopic}
                  >
                    {t('viewMeetupPage.approveTopicBtn')}
                  </Button>
                </>
              ) : (
                !!meetup.canLoggedUserSupport && (
                  <Button
                    id="btn-vote-toggle"
                    className={classNames(
                      styles.actionButton,
                      styles.toggleSupportBtn,
                    )}
                    variant={
                      !meetup.hasLoggedUserVoted
                        ? ButtonVariant.Primary
                        : ButtonVariant.Secondary
                    }
                    onClick={toggleSupportTopic}
                  >
                    {!meetup.hasLoggedUserVoted
                      ? t('viewMeetupPage.supportTopicBtn')
                      : t('viewMeetupPage.unsupportTopicBtn')}
                  </Button>
                )
              ))}
            {status === MeetupStatus.DRAFT && !!loggedUser.isAdmin && (
              <Button
                id="btn-publish"
                className={classNames(styles.actionButton, styles.publishBtn)}
                variant={ButtonVariant.Primary}
                onClick={handlePublishMeetup}
                disabled={!canPublish}
              >
                {t('formButtons.publish')}
              </Button>
            )}
            {status === MeetupStatus.CONFIRMED &&
              !isFinished &&
              !loggedUser.isAdmin &&
              !!meetup.canLoggedUserSupport && (
                <Button
                  id="btn-join-toggle"
                  className={classNames(
                    styles.actionButton,
                    styles.toggleJoinBtn,
                  )}
                  variant={
                    !meetup.hasLoggedUserJoined
                      ? ButtonVariant.Primary
                      : ButtonVariant.Secondary
                  }
                  onClick={toggleJoinMeetup}
                >
                  {!meetup.hasLoggedUserJoined
                    ? t('viewMeetupPage.joinMeetupBtn')
                    : t('viewMeetupPage.unjoinMeetupBtn')}
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
        {renderSpeakers()}
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
        {renderSupporters()}
        {renderActions()}
      </div>
    </section>
  );
});
