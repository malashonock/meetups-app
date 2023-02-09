import { useNavigate, useParams } from 'react-router';
import classNames from 'classnames';

import {
  Button,
  ButtonVariant,
  Typography,
  TypographyComponent,
  UserPreview,
  UserPreviewVariant,
} from 'components';
import { MeetupStatus, ShortUser } from 'model';
import { parseDateString } from 'utils';
import { NotFoundPage } from 'pages';
import { useMeetupQuery } from 'hooks';

import styles from './ViewMeetupPage.module.scss';
import defaultImage from 'assets/images/default-image.jpg';
import calendar from './assets/calendar.svg';
import clock from './assets/clock.svg';
import pin from './assets/pin.svg';

const MAX_PREVIEW_USERS = 8;

export const ViewMeetupPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { meetup, isLoading } = useMeetupQuery(id!);
  const votedUsers = meetup?.votedUsers ?? [];

  if (isLoading || meetup === undefined) {
    return <div>Загрузка...</div>;
  }

  if (meetup === null) {
    return <NotFoundPage />;
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
    imageUrl,
  } = meetup;

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
            src={imageUrl ?? defaultImage}
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
        parseDateString(start);

      date = `${formattedWeekdayLong}, ${formattedDate}`;
      time = `${formattedTime}`;

      if (finish) {
        const { formattedTime } = parseDateString(finish);

        time = time + ` — ${formattedTime}`;
      }
    }

    return (
      <div className={styles.data}>
        <Typography
          component={TypographyComponent.Span}
          className={styles.dataName}
        >
          Время и место проведения
        </Typography>
        <div className={styles.dataContent}>
          <div className={styles.timePlaceInfo}>
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
          <UserPreview user={author} />
        ) : (
          <div className={styles.speakerWrapper}>
            {speakers.map((speaker) => (
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

    const previewVotedUsers = votedUsers.slice(0, MAX_PREVIEW_USERS);

    return (
      <div className={styles.data}>
        <Typography
          component={TypographyComponent.Span}
          className={styles.dataName}
        >
          Поддерживают
        </Typography>
        <div className={classNames(styles.dataContent, styles.votedUsers)}>
          {previewVotedUsers.map((user: ShortUser) => (
            <UserPreview
              key={user.id}
              variant={UserPreviewVariant.Image}
              user={user}
            />
          ))}
          {votedUsers.length - MAX_PREVIEW_USERS > 0 && (
            <div className={styles.restCounter}>
              +{votedUsers.length - MAX_PREVIEW_USERS}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActions = () => {
    return (
      <div className={classNames(styles.dataContent, styles.actions)}>
        <Button variant={ButtonVariant.Default} onClick={() => navigate(-1)}>
          Назад
        </Button>
        {status === MeetupStatus.REQUEST && (
          <div className={styles.actionsWrapper}>
            <Button variant={ButtonVariant.Secondary}>Удалить</Button>
            <Button variant={ButtonVariant.Primary}>Одобрить тему</Button>
          </div>
        )}
        {status === MeetupStatus.DRAFT && (
          <div className={styles.actionsWrapper}>
            <Button variant={ButtonVariant.Secondary}>Удалить</Button>
            <Button variant={ButtonVariant.Primary}>Опубликовать</Button>
          </div>
        )}
        {status === MeetupStatus.CONFIRMED && (
          <Button variant={ButtonVariant.Secondary}>Удалить</Button>
        )}
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
};
