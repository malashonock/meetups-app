import { makeAutoObservable, runInAction } from 'mobx';
import { AxiosError } from 'axios';

import { Credentials, IFullUser, UserRole } from 'model';
import * as API from 'api';
import { RootStore, User, UserStore } from 'stores';
import { Nullable } from 'types';

export class AuthStore {
  loggedUser: Nullable<FullUser>;
  userStore: UserStore;

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);

    this.loggedUser = null;
    this.userStore = new UserStore(this);
  }

  async init(): Promise<void> {
    await this.checkLogin();
  }

  async checkLogin(): Promise<void> {
    try {
      const userData: IFullUser = await API.checkLogin();
      runInAction(() => {
        this.loggedUser = new FullUser(userData);
      });
      await this.onLoginChanged();
    } catch (error) {
      const { code } = error as AxiosError;
      if (code === '401') {
        this.loggedUser = null;
      }
    }
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

  get isAdmin(): boolean {
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
