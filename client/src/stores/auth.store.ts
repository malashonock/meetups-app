import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import i18n from 'i18n';

import { AppError, Credentials, IFullUser, UserRole } from 'model';
import * as API from 'api';
import { RootStore, User, UserStore } from 'stores';
import { Alert, AlertSeverity, Loadable, Nullable } from 'types';

export class AuthStore extends Loadable {
  loggedUser: Nullable<FullUser>;
  userStore: UserStore;
  isInitialized: boolean;

  constructor(public rootStore: RootStore) {
    super();
    this.setupObservable();

    this.loggedUser = null;
    this.isInitialized = false;
    this.userStore = new UserStore(this);

    this.onError = (error: AppError): void => {
      const { problem, hint } = error;
      this.rootStore.onAlert({
        severity: AlertSeverity.Error,
        title: problem,
        text: hint,
      });
    };
  }

  setupObservable(): void {
    makeObservable(this, {
      loggedUser: observable,
      userStore: observable,
      isInitialized: observable,
      init: action,
      checkLogin: action,
      logIn: action,
      logOut: action,
      onLoginChanged: action,
    });
  }

  async init(): Promise<void> {
    await this.tryLoad(async () => {
      await this.checkLogin();
    });

    this.isInitialized = true;
  }

  async checkLogin(): Promise<void> {
    await this.tryLoad(
      async () => {
        const userData: IFullUser = await API.checkLogin();
        runInAction(() => {
          this.loggedUser = new FullUser(userData);
        });
        await this.onLoginChanged();
      },
      (error: AppError) => {
        const { code } = error;
        if (code === '401') {
          // 401 is expected here intentionally
          this.loggedUser = null;
        } else if (this.onError) {
          // bubble other error types up
          this.onError(error);
        }
      },
    );
  }

  async logIn(credentials: Credentials): Promise<void> {
    await this.tryLoad(async () => {
      const userData: IFullUser = await API.login(credentials);
      runInAction(() => {
        this.loggedUser = new FullUser(userData);
      });
      await this.onLoginChanged();
    });

    this.rootStore.onAlert(
      new Alert(
        {
          severity: AlertSeverity.Success,
          text: i18n.t('alerts.user.loggedIn'),
        },
        this.rootStore.uiStore,
      ),
    );
  }

  async logOut(): Promise<void> {
    await this.tryLoad(async () => {
      await API.logout();
      runInAction(() => {
        this.loggedUser = null;
      });
      await this.onLoginChanged();
    });

    this.rootStore.onAlert(
      new Alert(
        {
          severity: AlertSeverity.Success,
          text: i18n.t('alerts.user.loggedOut'),
        },
        this.rootStore.uiStore,
      ),
    );
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

    makeObservable(this, {
      post: observable,
      roles: observable,
      isAdmin: computed,
    });

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
