import { useContext } from 'react';

import { Meetup, MeetupStore } from 'stores';
import { RootContext } from 'App';
import { MeetupFields } from 'model';
import { Optional } from 'types';

export interface UseMeetupStoreResult {
  meetupStore?: MeetupStore;
  meetups?: Meetup[];
  createMeetup?: (meetupData: MeetupFields) => Promise<Meetup>;
  findMeetup?: (id: string) => Optional<Meetup>;
}

export const useMeetupStore = (): UseMeetupStoreResult => {
  const meetupStore = useContext(RootContext)?.meetupStore;
  const meetups = meetupStore?.meetups;
  const createMeetup = meetupStore?.createMeetup;
  const findMeetup = meetupStore?.findMeetup;

  return {
    meetupStore,
    meetups,
    createMeetup,
    findMeetup,
  };
};
