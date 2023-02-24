import { AuthStore, UiStore } from 'stores';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
  }

  async init(): Promise<void> {
    await this.authStore.onLoginChanged();
  }

  toJSON() {
    return {
      authStore: this.authStore.toJSON(),
      uiStore: this.uiStore.toJSON(),
    };
  }
}
