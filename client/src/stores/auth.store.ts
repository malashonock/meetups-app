import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Credentials, IUser } from 'model';
import * as API from 'api';
import { RootStore, User } from 'stores';
import { Nullable } from 'types';

export class AuthStore {
  loggedUser: Nullable<User>;

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'auth',
      properties: [
        {
          key: 'loggedUser',
          serialize: (value: Nullable<User>): string => {
            return JSON.stringify(value);
          },
          deserialize: (value: string): Nullable<User> => {
            return value
              ? new User(JSON.parse(value) as IUser, this.rootStore.userStore)
              : null;
          },
        },
      ],
      storage: window.localStorage,
    });

    this.loggedUser = null;
  }

  async logIn(credentials: Credentials): Promise<void> {
    const { id, ...userData } = await API.login(credentials);
    runInAction(() => {
      this.loggedUser = this.rootStore.userStore.findUser(id) ?? null;
    });
  }

  async logOut(): Promise<void> {
    await API.logout();
    runInAction(() => {
      this.loggedUser = null;
    });
  }

  toJSON() {
    return {
      loggedUser: this.loggedUser,
    };
  }
}
