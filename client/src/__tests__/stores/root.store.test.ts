import {
  AuthStore,
  MeetupStore,
  NewsStore,
  RootStore,
  UiStore,
  UserStore,
} from 'stores';

const spiedOnAuthStoreInit = jest.spyOn(AuthStore.prototype, 'init');

describe('RootStore', () => {
  describe('constructor', () => {
    it('should initialize authStore field to a new AuthStore instance', () => {
      const rootStore = new RootStore();
      expect(rootStore.authStore).not.toBeNull();
      expect(rootStore.authStore instanceof AuthStore).toBe(true);
    });

    it('should initialize uiStore field to a new UiStore instance', () => {
      const rootStore = new RootStore();
      expect(rootStore.uiStore).not.toBeNull();
      expect(rootStore.uiStore instanceof UiStore).toBe(true);
    });

    it('should initialize meetupStore field to a new MeetupStore instance', () => {
      const rootStore = new RootStore();
      expect(rootStore.meetupStore).not.toBeNull();
      expect(rootStore.meetupStore instanceof MeetupStore).toBe(true);
    });

    it('should initialize newsStore field to a new NewsStore instance', () => {
      const rootStore = new RootStore();
      expect(rootStore.newsStore).not.toBeNull();
      expect(rootStore.newsStore instanceof NewsStore).toBe(true);
    });
  });

  describe('init() instance method', () => {
    it('should call AuthStore init() method', async () => {
      const rootStore = new RootStore();
      await rootStore.init();
      expect(spiedOnAuthStoreInit).toHaveBeenCalled();
    });
  });
});
