import { getMeetups } from 'api';
import { Button, ButtonVariant, MeetupCard } from 'components';
import { Meetup, MeetupStatus } from 'model';
import { useEffect, useState } from 'react';

import styles from './TopicsTab.module.scss';

export const TopicsTab = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);

  useEffect(() => {
    (async () => {
      const meetups = await getMeetups();

      setMeetups(
        meetups.filter((meetup) => meetup.status === MeetupStatus.DRAFT),
      );
    })();
  }, []);

  const getCounterEnding = (num: number) => {
    const lastNumber = num % 10;

    if (lastNumber === 1) return 'тема предложена';
    if ([2, 3, 4].includes(lastNumber)) return 'темы предложены';
    if ([5, 6, 7, 8, 9, 0].includes(lastNumber)) return 'тем предложено';
  };

  return (
    <section className={styles.topicsTab}>
      <div className={styles.wrapper}>
        <div className={styles.counter}>
          {meetups.length} {getCounterEnding(meetups.length)}
        </div>
        <Button variant={ButtonVariant.Secondary}>+ Создать митап</Button>
      </div>
      <div className={styles.topics}>
        {meetups.map((meetup) => (
          <MeetupCard
            meetup={{
              id: meetup.id,
              status: meetup.status,
              author: meetup.author,
              subject: meetup.subject,
              modified: meetup.modified,
              speakers: meetup.speakers,
              goCount: meetup.goCount,
              excerpt: meetup.excerpt,
              isOver: meetup.isOver,
            }}
          />
        ))}
        ,
      </div>
    </section>
  );
};
