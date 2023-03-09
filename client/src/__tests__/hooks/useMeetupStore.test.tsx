import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';

import { useMeetupStore } from 'hooks';
import { RootStore } from 'stores';
import { RootContext } from 'components';
import * as MeetupApi from 'api/services/meetup.service';
import { mockMeetupData } from 'model/__fakes__';

const mockRootStore = new RootStore();

const MockRootStoreProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  return (
    <RootContext.Provider value={mockRootStore}>
      {children}
    </RootContext.Provider>
  );
};

const spiedOnApiGetMeetups = jest.spyOn(MeetupApi, 'getMeetups');

beforeEach(() => {
  spiedOnApiGetMeetups.mockResolvedValue([mockMeetupData]);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useMeetupStore hook', () => {
  describe('given root context is not yet set up', () => {
    it('should return an object with undefined properties', () => {
      const { result } = renderHook(() => useMeetupStore());

      expect(result.current.meetupStore).toBeUndefined();
      expect(result.current.meetups).toBeUndefined();
      expect(result.current.isLoading).toBeUndefined();
      expect(result.current.isError).toBeUndefined();
      expect(result.current.errors).toBeUndefined();
      expect(result.current.createMeetup).toBeUndefined();
      expect(result.current.findMeetup).toBeUndefined();
    });
  });

  describe('given root context is set up', () => {
    it('should return an object containing correctly initialized properties', async () => {
      const { result, rerender } = renderHook(() => useMeetupStore(), {
        wrapper: MockRootStoreProvider,
      });

      // loadMeetups is run async, need to wait for next update
      rerender();

      expect(result.current.meetupStore?.toJSON()).toStrictEqual(
        mockRootStore.meetupStore.toJSON(),
      );
      expect(result.current.meetups).toStrictEqual(
        mockRootStore.meetupStore.meetups,
      );
      expect(result.current.isLoading).toBe(
        mockRootStore.meetupStore.isLoading,
      );
      expect(result.current.isError).toBe(mockRootStore.meetupStore.isError);
      expect(result.current.errors).toStrictEqual(
        mockRootStore.meetupStore.errors,
      );
      expect(result.current.createMeetup).toBe(
        mockRootStore.meetupStore.createMeetup,
      );
      expect(result.current.findMeetup).toBe(
        mockRootStore.meetupStore.findMeetup,
      );
    });
  });
});
