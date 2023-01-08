import React, { useEffect, useState } from 'react';
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
import { getMeetup, getVotedUsers } from 'api';
import { Meetup, MeetupStatus, ShortUser } from 'model';
import { parseDateString } from 'helpers';

import styles from './ViewMeetupPage.module.scss';
import defaultImage from './assets/default-image.jpg';
import calendar from './assets/calendar.svg';
import clock from './assets/clock.svg';
import pin from './assets/pin.svg';

const MAX_PREVIEW_USERS = 8;

export const ViewMeetupPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [votedUsers, setVotedUsers] = useState<ShortUser[]>([]);

  useEffect(() => {
    (async () => {
      setMeetup(await getMeetup(id!));
      setVotedUsers(await getVotedUsers(id!));
    })();
  }, [id]);

  if (meetup === null) {
    return <div>Что-то пошло не так</div>;
  }

  const renderHeader = () => {
    if (meetup.status === MeetupStatus.DRAFT) {
      return (
        <div className={styles.data}>
          <span className={styles.dataName}>Название</span>
          <div className={styles.dataContent}>
            <Typography
              className={styles.meetupHeading}
              component={TypographyComponent.Heading2}
            >
              {meetup.subject}
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.headerData}>
        <img
          className={styles.image}
          src={defaultImage}
          alt="Изображение митапа"
        />
        <div className={styles.headerDataContent}>
          <Typography
            className={styles.meetupHeading}
            component={TypographyComponent.Heading2}
          >
            {meetup.subject}
          </Typography>
        </div>
      </div>
    );
  };

  const renderTimePlace = () => {
    if (meetup.status === MeetupStatus.DRAFT) {
      return null;
    }

    let date, time;

    if (meetup.start) {
      const { formattedWeekDay, formattedDate, formattedTime } =
        parseDateString(meetup.start);

      date = `${formattedWeekDay}, ${formattedDate}`;
      time = `${formattedTime}`;

      if (meetup.finish) {
        const { formattedTime } = parseDateString(meetup.finish);

        time = time + ` — ${formattedTime}`;
      }
    }

    return (
      <div className={styles.data}>
        <span className={styles.dataName}>Время и место проведения</span>
        <div className={styles.dataContent}>
          <div className={styles.timePlaceInfo}>
            <div className={styles.info}>
              <img className={styles.image} src={calendar} alt="Дата" />
              <span>{date || '—'}</span>
            </div>
            <div className={styles.info}>
              <img className={styles.image} src={clock} alt="Время" />
              <span>{time || '—'}</span>
            </div>
            <div className={styles.info}>
              <img className={styles.image} src={pin} alt="Место" />
              <span>{meetup.place || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    );

    // return <div>Что-то пошло не так</div>;
  };

  const renderAuthor = () => {
    return (
      <div className={styles.data}>
        <span className={styles.dataName}>
          {meetup.status === MeetupStatus.DRAFT ? 'Автор' : 'Спикер'}
        </span>
        <div className={styles.dataContent}>
          {meetup.status === MeetupStatus.DRAFT ? (
            <UserPreview
              variant={UserPreviewVariant.Default}
              user={meetup.author}
            />
          ) : (
            <div className={styles.speakerWrapper}>
              {meetup.speakers.map((speaker) => (
                <UserPreview
                  variant={UserPreviewVariant.Default}
                  user={speaker}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVotedUsers = () => {
    if (votedUsers?.length === 0) {
      return null;
    }

    const previewVotedUsers = votedUsers.slice(0, MAX_PREVIEW_USERS);

    return (
      <div className={styles.data}>
        <span className={styles.dataName}>Поддерживают</span>
        <div className={classNames(styles.dataContent, styles.votedUsers)}>
          {previewVotedUsers.map((user: ShortUser) => (
            <UserPreview variant={UserPreviewVariant.Image} user={user} />
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
        {meetup.status === MeetupStatus.DRAFT && (
          <div className={styles.actionsWrapper}>
            <Button variant={ButtonVariant.Secondary}>Удалить</Button>
            <Button variant={ButtonVariant.Primary}>Одобрить Тему</Button>
          </div>
        )}
        {meetup.status === MeetupStatus.REQUEST && (
          <div className={styles.actionsWrapper}>
            <Button variant={ButtonVariant.Secondary}>Удалить</Button>
            <Button variant={ButtonVariant.Primary}>Опубликовать</Button>
          </div>
        )}
        {meetup.status === MeetupStatus.CONFIRMED && (
          <Button variant={ButtonVariant.Secondary}>Удалить</Button>
        )}
      </div>
    );
  };

  return (
    <section className={styles.container}>
      <Typography
        className={styles.heading}
        component={TypographyComponent.Heading1}
      >
        Просмотр {meetup.status === MeetupStatus.DRAFT ? 'Темы' : 'Митапа'}
      </Typography>
      <div className={styles.dataWrapper}>
        {renderHeader()}
        {renderTimePlace()}
        {renderAuthor()}
        <div className={styles.data}>
          <span className={styles.dataName}>Описание</span>
          <div className={styles.dataContent}>
            <p className={styles.excerpt}>{meetup.excerpt}</p>
          </div>
        </div>
        {renderVotedUsers()}
        {renderActions()}
      </div>
    </section>
  );
};
