import { AuthStore, MeetupStore, NewsStore, UiStore } from 'stores';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  meetupStore: MeetupStore;
  newsStore: NewsStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.meetupStore = new MeetupStore(this);
    this.newsStore = new NewsStore(this);
  }

  async init(): Promise<RootStore> {
    await this.meetupStore.loadMeetups();
    await this.newsStore.loadNews();
    return this;
  }
}
