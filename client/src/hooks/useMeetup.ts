import { Meetup } from 'stores';
import { Maybe, Optional } from 'types';
import { useMeetupStore } from './useMeetupStore';

export const useMeetup = (id: Maybe<string>): Optional<Meetup> => {
  const { meetupStore } = useMeetupStore();

  if (!id) {
    return undefined;
  }

  const meetup = meetupStore?.findMeetup(id);

  return meetup;
};
