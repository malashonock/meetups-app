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

export const useMeetup = (id: Maybe<string>): UseMeetupResult => {
  const { meetupStore } = useMeetupStore();
  const [isInitialized, setIsInitialized] =
    useState<Optional<boolean>>(undefined);

  const meetup = id ? meetupStore?.findMeetup(id) : undefined;

  // Hydrate meetup on first load
  useEffect((): void => {
    (async (): Promise<void> => {
      if (meetup && !meetup?.isInitialized) {
        await meetup?.init();
      }
    })();
  }, [meetup, meetup?.isInitialized]);

  // Keep track of isInitialized field
  useEffect(() => {
    setIsInitialized(meetup?.isInitialized);
  }, [meetup?.isInitialized]);

  const isLoading = meetup?.isLoading;
  const isError = meetup?.isError;
  const errors = meetup?.errors;

  return {
    meetup,
    isInitialized,
    isLoading,
    isError,
    errors,
  };
};
