import { AuthStore, MeetupStore, NewsStore, UiStore } from 'stores';
import { Alert, AlertProps } from 'types';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  meetupStore: MeetupStore;
  newsStore: NewsStore;
  onAlert: (alertData: AlertProps) => void;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.meetupStore = new MeetupStore(this);
    this.newsStore = new NewsStore(this);
    this.onAlert = (alertData: AlertProps): void => {
      this.uiStore.onAlertCreated(new Alert(alertData, this.uiStore));
    };
  }

  async init(): Promise<void> {
    await this.authStore.init();
  }

  toJSON() {
    return {
      authStore: this.authStore.toJSON(),
      uiStore: this.uiStore.toJSON(),
    };
  }
}
