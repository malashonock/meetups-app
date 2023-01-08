import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Button,
  ButtonVariant,
  MeetupCard,
  MeetupCardVariant,
} from 'components';
import { getMeetups } from 'api';
import { Meetup, MeetupStatus } from 'model';

import styles from './MeetupTabContent.module.scss';
import { NavLink } from 'react-router-dom';

interface MeetupTabContentProps {
  variant: MeetupCardVariant;
}

export const MeetupTabContent = ({ variant }: MeetupTabContentProps) => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);

  const navigate = useNavigate();

  const openCreateMeetupPage = () => navigate('/meetups/create');

  useEffect(() => {
    (async () => {
      const meetups = await getMeetups();

      switch (variant) {
        case MeetupCardVariant.Topic:
          setMeetups(
            meetups.filter((meetup) => meetup.status === MeetupStatus.DRAFT),
          );
          break;
        case MeetupCardVariant.OnModeration:
          setMeetups(
            meetups.filter((meetup) => meetup.status === MeetupStatus.REQUEST),
          );
          break;
        case MeetupCardVariant.Upcoming:
        case MeetupCardVariant.Finished:
          setMeetups(
            meetups.filter(
              (meetup) =>
                meetup.status === MeetupStatus.CONFIRMED &&
                meetup.isOver === (variant === MeetupCardVariant.Finished),
            ),
          );
          break;
      }
    })();
  }, [variant]);

  const getCounterEnding = (num: number, variant: MeetupCardVariant) => {
    const lastNumber = num % 10;

    switch (variant) {
      case MeetupCardVariant.Topic:
        if (lastNumber === 1) return 'тема предложена';
        if ([2, 3, 4].includes(lastNumber)) return 'темы предложено';
        if ([5, 6, 7, 8, 9, 0].includes(lastNumber)) return 'тем предложено';
        break;
      case MeetupCardVariant.OnModeration:
        if (lastNumber === 1) return 'митап на модерации';
        if ([2, 3, 4].includes(lastNumber)) return 'митапа на модерации';
        if ([5, 6, 7, 8, 9, 0].includes(lastNumber))
          return 'митапов на модерации';
        break;
      case MeetupCardVariant.Upcoming:
        if (lastNumber === 1) return 'митап опубликован';
        if ([2, 3, 4].includes(lastNumber)) return 'митапа опубликовано';
        if ([5, 6, 7, 8, 9, 0].includes(lastNumber))
          return 'митапов опубликовано';
        break;
      case MeetupCardVariant.Finished:
        if (lastNumber === 1) return 'митап прошёл';
        if ([2, 3, 4].includes(lastNumber)) return 'митапа прошло';
        if ([5, 6, 7, 8, 9, 0].includes(lastNumber)) return 'митапов прошло';
        break;
    }
  };

  return (
    <section className={styles.topicsTab}>
      <div className={styles.wrapper}>
        <div className={styles.counter}>
          {meetups.length} {getCounterEnding(meetups.length, variant)}
        </div>
        {variant === MeetupCardVariant.Topic && (
          <Button
            variant={ButtonVariant.Secondary}
            onClick={openCreateMeetupPage}
          >
            + Создать митап
          </Button>
        )}
      </div>
      <div className={styles.topics}>
        {meetups.map((meetup) => (
          <NavLink to={`/meetups/${meetup.id}`} key={meetup.id}>
            <MeetupCard meetup={meetup} />
          </NavLink>
        ))}
      </div>
    </section>
  );
};
