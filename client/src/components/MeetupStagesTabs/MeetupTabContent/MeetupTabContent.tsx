import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  LoadingSpinner,
  MeetupCard,
  MeetupCardVariant,
} from 'components';
import { NotFoundPage } from 'pages';
import { MeetupStatus } from 'model';
import { Meetup } from 'stores';
import { useAuthStore, useMeetupStore } from 'hooks';
import { isPast } from 'utils';

import styles from './MeetupTabContent.module.scss';

interface MeetupTabContentProps {
  variant: MeetupCardVariant;
}

export const MeetupTabContent = observer(
  ({ variant }: MeetupTabContentProps) => {
    const { loggedUser } = useAuthStore();
    const meetupStore = useMeetupStore();
    const { meetups } = meetupStore;
    const [selectedMeetups, setSelectedMeetups] = useState<Meetup[]>();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const openCreateMeetupPage = () => navigate('/meetups/create');

    useEffect(() => {
      switch (variant) {
        case MeetupCardVariant.Topic:
          setSelectedMeetups(
            meetups.filter((meetup) => meetup.status === MeetupStatus.REQUEST),
          );
          break;
        case MeetupCardVariant.Draft:
          setSelectedMeetups(
            meetups.filter((meetup) => meetup.status === MeetupStatus.DRAFT),
          );
          break;
        case MeetupCardVariant.Upcoming:
          setSelectedMeetups(
            meetups.filter(
              (meetup) =>
                meetup.status === MeetupStatus.CONFIRMED &&
                (!meetup.start || (meetup.start && !isPast(meetup.start))),
            ),
          );
          break;
        case MeetupCardVariant.Finished:
          setSelectedMeetups(
            meetups.filter(
              (meetup) =>
                meetup.status === MeetupStatus.CONFIRMED &&
                meetup.start &&
                isPast(meetup.start),
            ),
          );
          break;
      }
    }, [variant, meetups, meetups.length]);

    if (meetupStore.isError) {
      return <NotFoundPage />;
    }

    return (
      <section className={styles.meetupsTab}>
        {meetupStore.isLoading ? (
          <LoadingSpinner text={t('loadingText.meetups')} />
        ) : (
          <>
            <div className={styles.wrapper}>
              <div className={styles.counter} data-testid="meetup-counter">
                {t('meetupTabContent.meetupCount', {
                  context: variant,
                  count: selectedMeetups?.length || 0,
                })}
              </div>
              {loggedUser && variant === MeetupCardVariant.Topic && (
                <Button
                  id="btn-create-meetup"
                  variant={ButtonVariant.Secondary}
                  onClick={openCreateMeetupPage}
                  className={styles.createMeetupBtn}
                >
                  {t('meetupTabContent.createMeetupBtn')}
                </Button>
              )}
            </div>
            <div className={styles.meetups}>
              {selectedMeetups?.map((meetup) => (
                <NavLink to={`/meetups/${meetup.id}`} key={meetup.id}>
                  <MeetupCard meetup={meetup} />
                </NavLink>
              ))}
            </div>
          </>
        )}
      </section>
    );
  },
);
