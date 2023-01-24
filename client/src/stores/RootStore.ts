import { AuthStore, MeetupStore, UiStore } from 'stores';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  meetupStore: MeetupStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.meetupStore = new MeetupStore(this);
  }

  async init(): Promise<RootStore> {
    await this.meetupStore.loadMeetups();
    return this;
  }
}
