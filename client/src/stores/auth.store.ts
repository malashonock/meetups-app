import { flow, makeObservable, observable, runInAction } from 'mobx';
// import { makePersistable } from 'mobx-persist-store';

import { Credentials } from 'model';
import * as API from 'api';
import { RootStore, User } from 'stores';
import { Nullable } from 'types';

export class AuthStore {
  loggedUser: Nullable<User>;

  constructor(public rootStore: RootStore) {
    makeObservable(this, {
      loggedUser: observable,
      logIn: flow,
      logOut: flow,
    });

    // makePersistable(this, {
    //   name: 'auth',
    //   properties: ['loggedUser'],
    //   storage: window.localStorage,
    // });

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
}
