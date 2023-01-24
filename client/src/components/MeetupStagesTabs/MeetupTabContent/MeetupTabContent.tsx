import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import {
  Button,
  ButtonVariant,
  MeetupCard,
  MeetupCardVariant,
} from 'components';
import { MeetupStatus } from 'model';
import { Meetup } from 'stores';
import { useMeetupStore } from 'hooks';
import { isPast } from 'utils';

import styles from './MeetupTabContent.module.scss';

interface MeetupTabContentProps {
  variant: MeetupCardVariant;
}

export const MeetupTabContent = observer(
  ({ variant }: MeetupTabContentProps) => {
    const { meetups } = useMeetupStore();
    const [selectedMeetups, setSelectedMeetups] = useState<Meetup[]>();

    const navigate = useNavigate();

    const openCreateMeetupPage = () => navigate('/meetups/create');

    useEffect(() => {
      switch (variant) {
        case MeetupCardVariant.Topic:
          setSelectedMeetups(
            meetups?.filter((meetup) => meetup.status === MeetupStatus.REQUEST),
          );
          break;
        case MeetupCardVariant.OnModeration:
          setSelectedMeetups(
            meetups?.filter((meetup) => meetup.status === MeetupStatus.DRAFT),
          );
          break;
        case MeetupCardVariant.Upcoming:
          setSelectedMeetups(
            meetups?.filter(
              (meetup) =>
                (meetup.status === MeetupStatus.CONFIRMED && !meetup.start) ||
                (meetup.start && !isPast(meetup.start)),
            ),
          );
          break;
        case MeetupCardVariant.Finished:
          setSelectedMeetups(
            meetups?.filter(
              (meetup) =>
                meetup.status === MeetupStatus.CONFIRMED &&
                meetup.start &&
                isPast(meetup.start),
            ),
          );
          break;
      }
    }, [variant, meetups]);

    const getCounterEnding = (num: number, variant: MeetupCardVariant) => {
      const lastNumber = num % 10;
      const lastTwoNumbers = num % 100;

      switch (variant) {
        case MeetupCardVariant.Topic:
          if (
            [5, 6, 7, 8, 9, 0].includes(lastNumber) ||
            [11, 12, 13, 14].includes(lastTwoNumbers)
          )
            return 'тем предложено';
          if ([2, 3, 4].includes(lastNumber)) return 'темы предложено';
          if (lastNumber === 1) return 'тема предложена';
          break;
        case MeetupCardVariant.OnModeration:
          if (
            [5, 6, 7, 8, 9, 0].includes(lastNumber) ||
            [11, 12, 13, 14].includes(lastTwoNumbers)
          )
            return 'митапов на модерации';
          if ([2, 3, 4].includes(lastNumber)) return 'митапа на модерации';
          if (lastNumber === 1) return 'митап на модерации';
          break;
        case MeetupCardVariant.Upcoming:
          if (
            [5, 6, 7, 8, 9, 0].includes(lastNumber) ||
            [11, 12, 13, 14].includes(lastTwoNumbers)
          )
            return 'митапов опубликовано';
          if ([2, 3, 4].includes(lastNumber)) return 'митапа опубликовано';
          if (lastNumber === 1) return 'митап опубликован';
          break;
        case MeetupCardVariant.Finished:
          if (
            [5, 6, 7, 8, 9, 0].includes(lastNumber) ||
            [11, 12, 13, 14].includes(lastTwoNumbers)
          )
            return 'митапов прошло';
          if ([2, 3, 4].includes(lastNumber)) return 'митапа прошло';
          if (lastNumber === 1) return 'митап прошёл';
          break;
      }
    };

    return (
      <section className={styles.topicsTab}>
        <div className={styles.wrapper}>
          <div className={styles.counter}>
            {selectedMeetups?.length}{' '}
            {getCounterEnding(selectedMeetups?.length || 0, variant)}
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
          {selectedMeetups?.map((meetup) => (
            <NavLink to={`/meetups/${meetup.id}`} key={meetup.id}>
              <MeetupCard meetup={meetup} />
            </NavLink>
          ))}
        </div>
      </section>
    );
  },
);
