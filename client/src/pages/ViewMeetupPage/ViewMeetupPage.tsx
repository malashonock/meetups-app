import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import {
  Button,
  ButtonVariant,
  Typography,
  TypographyComponent,
  UserPreview,
  UserPreviewVariant,
} from 'components';
import { MeetupStatus } from 'model';
import { isPast, parseDate } from 'utils';
import { NotFoundPage } from 'pages';
import { User } from 'stores';
import { useMeetup, useUserStore } from 'hooks';
import { Optional } from 'types';

import styles from './ViewMeetupPage.module.scss';
import defaultImage from 'assets/images/default-image.jpg';
import calendar from './assets/calendar.svg';
import clock from './assets/clock.svg';
import pin from './assets/pin.svg';

const MAX_PREVIEW_USERS = 8;

export const ViewMeetupPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const meetup = useMeetup(id);
  const { userStore } = useUserStore();

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
    if (!window.confirm('Вы уверены, что хотите удалить тему?')) {
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
            Название
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
            alt="Изображение митапа"
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
      const { formattedWeekdayLong, formattedDate, formattedTime } =
        parseDate(start);

      date = `${formattedWeekdayLong}, ${formattedDate}, ${start.getFullYear()}`;
      time = `${formattedTime}`;

      if (finish) {
        const { formattedTime } = parseDate(finish);

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
            ? 'Время и место проведения'
            : 'Перед публикацией заполните время и место проведения митапа'}
        </Typography>
        <div
          className={classNames(styles.dataContent, styles.timePlaceInfo, {
            [styles.notFilledOutline]: !canPublish,
          })}
        >
          <div className={styles.info}>
            <img className={styles.image} src={calendar} alt="Дата" />
            <Typography component={TypographyComponent.Span}>
              {date || '—'}
            </Typography>
          </div>
          <div className={styles.info}>
            <img className={styles.image} src={clock} alt="Время" />
            <Typography component={TypographyComponent.Span}>
              {time || '—'}
            </Typography>
          </div>
          <div className={styles.info}>
            <img className={styles.image} src={pin} alt="Место" />
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
        {status === MeetupStatus.REQUEST ? 'Автор' : 'Спикер'}
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

    const previewVotedUsers = votedUsers?.slice(0, MAX_PREVIEW_USERS);

    return (
      <div className={styles.data}>
        <Typography
          component={TypographyComponent.Span}
          className={styles.dataName}
        >
          Поддерживают
        </Typography>
        <div className={classNames(styles.dataContent, styles.votedUsers)}>
          {previewVotedUsers?.map((votedUser: User) => (
            <UserPreview
              key={votedUser.id}
              variant={UserPreviewVariant.Image}
              user={votedUser}
            />
          ))}
          {(votedUsers?.length ?? 0) - MAX_PREVIEW_USERS > 0 && (
            <div className={styles.restCounter}>
              +{(votedUsers?.length ?? 0) - MAX_PREVIEW_USERS}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActions = () => {
    return (
      <div className={classNames(styles.dataContent, styles.actions)}>
        <Button
          className={styles.actionButton}
          variant={ButtonVariant.Default}
          onClick={handleBack}
        >
          Назад
        </Button>
        <div className={styles.actionsWrapper}>
          {status === MeetupStatus.REQUEST && (
            <>
              <Button
                className={styles.actionButton}
                variant={ButtonVariant.Secondary}
                onClick={handleDeleteTopic}
              >
                Удалить
              </Button>
              <Button
                className={styles.actionButton}
                variant={ButtonVariant.Primary}
                onClick={handleApproveTopic}
              >
                Одобрить тему
              </Button>
            </>
          )}
          {status === MeetupStatus.DRAFT && (
            <Button
              className={styles.actionButton}
              variant={ButtonVariant.Primary}
              onClick={handlePublishMeetup}
              disabled={!canPublish}
            >
              Опубликовать
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className={classNames(styles.container, styles[status])}>
      <Typography
        className={styles.heading}
        component={TypographyComponent.Heading1}
      >
        Просмотр {status === MeetupStatus.REQUEST ? 'темы' : 'митапа'}
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
            Описание
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
