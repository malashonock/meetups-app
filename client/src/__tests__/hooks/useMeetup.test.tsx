import { renderHook } from '@testing-library/react';

import { useMeetup } from 'hooks';
import { useMeetupStore } from 'hooks/useMeetupStore';
import { NotFoundError } from 'model';
import { mockMeetup } from 'model/__fakes__';
import { RootStore } from 'stores';

const mockRootStore = new RootStore();
mockRootStore.meetupStore.isInitialized = true;
const spiedOnMeetupStoreFindMeetup = jest.spyOn(
  mockRootStore.meetupStore,
  'findMeetup',
);

// Mock useMeetupStore hook
jest.mock('hooks/useMeetupStore', () => {
  return {
    useMeetupStore: jest.fn(),
  };
});
const mockUseMeetupStore = useMeetupStore as jest.MockedFunction<
  typeof useMeetupStore
>;

beforeEach(() => {
  mockUseMeetupStore.mockReturnValue(mockRootStore.meetupStore);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useMeetup hook', () => {
  describe('given the id of an existing meetup is provided', () => {
    it('should return the news article with the specified id', () => {
      spiedOnMeetupStoreFindMeetup.mockReturnValue(mockMeetup);
      const { result } = renderHook(() => useMeetup(mockMeetup.id));
      expect(result.current).toStrictEqual(mockMeetup);
    });
  });

  describe('given the id of a non-existing meetup is provided', () => {
    it('should return undefined', () => {
      spiedOnMeetupStoreFindMeetup.mockReturnValue(undefined);
      const { result } = renderHook(() => useMeetup(mockMeetup.id));
      expect(result.current).toBeUndefined();
    });
  });

  describe('given id arg is not provided', () => {
    it('should return undefined', () => {
      const { result } = renderHook(() => useMeetup(undefined));
      expect(result.current).toBeUndefined();
    });
  });
});
