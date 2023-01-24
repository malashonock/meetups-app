import { flow, makeObservable, observable } from 'mobx';
// import { makePersistable } from 'mobx-persist-store';

import { Credentials, User } from 'model';
import * as API from 'api';
import { RootStore } from 'stores';
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

  *logIn(credentials: Credentials) {
    try {
      const { password, ...userData } = yield API.login(credentials);
      this.loggedUser = userData as User;
    } catch (error) {
      console.log(error);
    }
  }

  *logOut() {
    try {
      yield API.logout();
      this.loggedUser = null;
    } catch (error) {
      console.log(error);
    }
  }
}
