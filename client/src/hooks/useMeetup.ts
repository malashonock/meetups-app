import { useEffect, useState } from 'react';

import { Meetup } from 'stores';
import { Maybe, Optional } from 'types';
import { useMeetupStore } from 'hooks';

interface UseMeetupResult {
  meetup?: Meetup;
  isInitialized?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  errors?: unknown[];
}

export const useMeetup = (id: Maybe<string>): Optional<Meetup> => {
  const meetupStore = useMeetupStore();

  const meetup = id ? meetupStore.findMeetup(id) : undefined;

  // Hydrate meetup on first load
  useEffect((): void => {
    (async (): Promise<void> => {
      if (meetup && !meetup?.isInitialized) {
        await meetup?.init();
      }
    })();
  }, [meetup, meetup?.isInitialized]);

  return meetup;
};
