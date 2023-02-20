import { AuthStore, MeetupStore, NewsStore, UiStore, UserStore } from 'stores';

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  uiStore: UiStore;
  meetupStore: MeetupStore;
  newsStore: NewsStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.uiStore = new UiStore(this);
    this.meetupStore = new MeetupStore(this);
    this.newsStore = new NewsStore(this);
  }

  async init(): Promise<RootStore> {
    await this.userStore.loadUsers();
    await this.meetupStore.loadMeetups();
    await this.newsStore.loadNews();
    return this;
  }

  toJSON() {
    return {
      authStore: this.authStore.toJSON(),
      userStore: this.userStore.toJSON(),
      uiStore: this.uiStore.toJSON(),
      meetupStore: this.meetupStore.toJSON(),
      newsStore: this.newsStore.toJSON(),
    };
  }
}
