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
  it('should return the meetup store', async () => {
    const { result, rerender } = renderHook(() => useMeetupStore(), {
      wrapper: MockRootStoreProvider,
    });

    // loadMeetups is run async, need to wait for next update
    rerender();

    expect(result.current.toJSON()).toStrictEqual(
      mockRootStore.meetupStore.toJSON(),
    );
  });
});
