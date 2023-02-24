import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { Credentials, IFullUser, UserRole } from 'model';
import * as API from 'api';
import { RootStore, User, UserStore } from 'stores';
import { Nullable } from 'types';

export class AuthStore {
  loggedUser: Nullable<FullUser>;
  userStore: UserStore;

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'auth',
      properties: [
        {
          key: 'loggedUser',
          serialize: (value: Nullable<FullUser>): string => {
            return JSON.stringify(value);
          },
          deserialize: (value: string): Nullable<FullUser> => {
            const userData = JSON.parse(value) as Nullable<IFullUser>;

            return userData ? new FullUser(userData) : null;
          },
        },
      ],
      storage: window.localStorage,
    });

    this.loggedUser = null;
    this.userStore = new UserStore(this);
  }

  async logIn(credentials: Credentials): Promise<void> {
    const userData: IFullUser = await API.login(credentials);
    runInAction(() => {
      this.loggedUser = new FullUser(userData);
    });
    await this.onLoginChanged();
  }

  async logOut(): Promise<void> {
    await API.logout();
    runInAction(() => {
      this.loggedUser = null;
    });
    await this.onLoginChanged();
  }

  async onLoginChanged(): Promise<void> {
    await this.userStore.init(this.loggedUser);
  }

  toJSON() {
    return {
      loggedUser: this.loggedUser,
    };
  }
}

export class FullUser extends User {
  post: string;
  roles: UserRole;

  constructor(userData: IFullUser) {
    super(userData);
    ({ post: this.post, roles: this.roles } = userData);
  }

  isAdmin(): boolean {
    return this.roles === UserRole.CHIEF;
  }

  toJSON(): IFullUser {
    return {
      ...super.toJSON(),
      post: this.post,
      roles: this.roles,
    };
  }
}
