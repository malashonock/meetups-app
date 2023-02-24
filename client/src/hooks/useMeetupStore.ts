import { useContext } from 'react';

import { Meetup, MeetupStore } from 'stores';
import { MeetupContext } from 'components';
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
  const meetupStore = useContext(MeetupContext);
  const meetups = meetupStore?.meetups;
  const isLoading = meetupStore?.isLoading;
  const isError = meetupStore?.isError;
  const errors = meetupStore?.errors;
  const createMeetup = meetupStore?.createMeetup;
  const findMeetup = meetupStore?.findMeetup;

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
