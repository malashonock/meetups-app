import { useContext, useEffect } from 'react';

import { Meetup, MeetupStore } from 'stores';
import { RootContext } from 'components';
import { MeetupFields } from 'model';
import { Optional } from 'types';

export interface UseMeetupStoreResult {
  meetupStore?: MeetupStore;
  meetups?: Meetup[];
  isLoading?: boolean;
  isError?: boolean;
  errors?: unknown[];
  createMeetup?: (meetupData: MeetupFields) => Promise<Optional<Meetup>>;
  findMeetup?: (id: string) => Optional<Meetup>;
}

export const useMeetupStore = (): UseMeetupStoreResult => {
  const meetupStore = useContext(RootContext)?.meetupStore;
  const meetups = meetupStore?.meetups;
  const isLoading = meetupStore?.isLoading;
  const isError = meetupStore?.isError;
  const errors = meetupStore?.errors;
  const createMeetup = meetupStore?.createMeetup;
  const findMeetup = meetupStore?.findMeetup;

  // Hydrate meetup store on first load
  useEffect((): void => {
    (async (): Promise<void> => {
      await meetupStore?.loadMeetups();
    })();
  }, [meetupStore]);

  return {
    meetupStore,
    meetups,
    isLoading,
    isError,
    errors,
    createMeetup,
    findMeetup,
  };
};
