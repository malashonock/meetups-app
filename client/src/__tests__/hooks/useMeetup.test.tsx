import { renderHook } from '@testing-library/react';

import { useMeetup } from 'hooks';
import { useMeetupStore } from 'hooks/useMeetupStore';
import { mockMeetup } from 'model/__fakes__';
import { RootStore } from 'stores';

const mockRootStore = new RootStore();
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
  mockUseMeetupStore.mockReturnValue({
    meetupStore: mockRootStore.meetupStore,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useMeetup hook', () => {
  describe('given id arg is provided', () => {
    describe('given useMeetupStore() hook returns an undefined meetupStore', () => {
      it('should return undefined', () => {
        mockUseMeetupStore.mockReturnValue({
          meetupStore: undefined,
        });

        const { result } = renderHook(() => useMeetup(mockMeetup.id));

        expect(result.current.meetup).toBeUndefined();
        expect(result.current.isInitialized).toBeUndefined();
        expect(result.current.isLoading).toBeUndefined();
        expect(result.current.isError).toBeUndefined();
        expect(result.current.errors).toBeUndefined();
      });
    });

    describe('given useMeetupStore() hook returns an initialized NewsStore instance', () => {
      it('should return the news article with the specified id', () => {
        spiedOnMeetupStoreFindMeetup.mockReturnValue(mockMeetup);

        const { result } = renderHook(() => useMeetup(mockMeetup.id));

        expect(result.current.meetup).toStrictEqual(mockMeetup);
        expect(result.current.isInitialized).toBe(mockMeetup.isInitialized);
        expect(result.current.isLoading).toBe(mockMeetup.isLoading);
        expect(result.current.isError).toBe(mockMeetup.isError);
        expect(result.current.errors).toStrictEqual(mockMeetup.errors);
      });
    });
  });

  describe('given id arg is not provided', () => {
    it('should return undefined', () => {
      const { result } = renderHook(() => useMeetup(undefined));

      expect(result.current.meetup).toBeUndefined();
      expect(result.current.isInitialized).toBeUndefined();
      expect(result.current.isLoading).toBeUndefined();
      expect(result.current.isError).toBeUndefined();
      expect(result.current.errors).toBeUndefined();
    });
  });
});
