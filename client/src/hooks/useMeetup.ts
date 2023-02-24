import { useEffect } from 'react';

import { Meetup } from 'stores';
import { Maybe } from 'types';
import { useMeetupStore } from 'hooks';

interface UseMeetupResult {
  meetup?: Meetup;
  isLoading?: boolean;
  isError?: boolean;
  errors?: unknown[];
}

export const useMeetup = (id: Maybe<string>): UseMeetupResult => {
  const { meetupStore } = useMeetupStore();

  const meetup = id ? meetupStore?.findMeetup(id) : undefined;

  // Hydrate meetup on first load
  useEffect((): void => {
    (async (): Promise<void> => {
      await meetup?.init();
    })();
  }, [meetup]);

  const isLoading = meetupStore?.isLoading;
  const isError = meetupStore?.isError;
  const errors = meetupStore?.errors;

  return {
    meetup,
    isLoading,
    isError,
    errors,
  };
};
