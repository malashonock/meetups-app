import { useContext, useEffect } from 'react';

import { MeetupStore } from 'stores';
import { RootContext } from 'components';

export const useMeetupStore = (): MeetupStore => {
  const meetupStore = useContext(RootContext).meetupStore;

  // Hydrate meetup store on first load
  useEffect((): void => {
    (async (): Promise<void> => {
      await meetupStore?.loadMeetups();
    })();
  }, [meetupStore]);

  return meetupStore;
};
