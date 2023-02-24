import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';

import { MeetupStore } from 'stores';
import { Optional } from 'types';

export const MeetupContext = createContext<Optional<MeetupStore>>(undefined);

export const MeetupStoreProvider = observer(
  ({ children }: PropsWithChildren): JSX.Element => {
    const [meetupStore] = useState((): MeetupStore => new MeetupStore());

    // Hydrate meetup store
    useEffect((): void => {
      (async (): Promise<void> => {
        await meetupStore.loadMeetups();
      })();
    }, [meetupStore]);

    return (
      <MeetupContext.Provider value={meetupStore}>
        <Outlet />
      </MeetupContext.Provider>
    );
  },
);
