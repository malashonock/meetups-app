import { action, makeObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Credentials, FullUser, User } from 'model';
import * as API from 'api';
import { RootStore } from 'stores';
import { Nullable } from 'types';

export class AuthStore {
  loggedUser: Nullable<User>;

  constructor(public rootStore: RootStore) {
    makeObservable(this, {
      loggedUser: observable,
      logIn: action,
      logOut: action,
    });

    makePersistable(this, {
      name: 'auth',
      properties: ['loggedUser'],
      storage: window.localStorage,
    });

    this.loggedUser = null;
  }

  async logIn(credentials: Credentials): Promise<void> {
    try {
      const { password, ...userData } = await API.login(credentials);
      this.loggedUser = userData as User;
    } catch (error) {
      console.log(error);
    }
  }

  async logOut(): Promise<void> {
    try {
      await API.logout();
      this.loggedUser = null;
    } catch (error) {
      console.log(error);
    }
  }
}
