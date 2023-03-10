import { useEffect, useState } from 'react';

import { Meetup } from 'stores';
import { Maybe, Optional } from 'types';
import { useMeetupStore } from 'hooks';
import { AppError, NotFoundError } from 'model';

interface UseMeetupResult {
  meetup?: Meetup;
  isInitialized?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  errors?: AppError[];
}

export const useMeetup = (id: Maybe<string>): UseMeetupResult => {
  const { meetupStore } = useMeetupStore();
  const [isInitialized, setIsInitialized] =
    useState<Optional<boolean>>(undefined);

  const meetup = id ? meetupStore?.findMeetup(id) : undefined;

  let isLoading: Optional<boolean> = undefined;
  let isError: Optional<boolean> = undefined;
  let errors: Optional<AppError[]> = undefined;

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

  isLoading = meetup?.isLoading ?? meetupStore?.isLoading;

  if (meetupStore && meetupStore.isInitialized && !meetup) {
    isError = true;
    errors = [new NotFoundError()];
  } else {
    isError = meetup?.isError;
    errors = meetup?.errors;
  }

  return {
    meetup,
    isInitialized,
    isLoading,
    isError,
    errors,
  };
};
