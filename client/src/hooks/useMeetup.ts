import { Meetup } from 'stores';
import { Maybe } from 'types';
import { useMeetupStore } from './useMeetupStore';

interface UseMeetupResult {
  meetup?: Meetup;
  isLoading?: boolean;
  isError?: boolean;
  errors?: unknown[];
}

export const useMeetup = (id: Maybe<string>): UseMeetupResult => {
  const { meetupStore } = useMeetupStore();

  if (!id) {
    return {};
  }

  const meetup = meetupStore?.findMeetup(id);
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
