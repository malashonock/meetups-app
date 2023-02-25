import {
  AuthStore,
  MeetupStore,
  NewsStore,
  RootStore,
  UiStore,
  UserStore,
} from 'stores';

const spiedOnLoadUsers = jest.spyOn(UserStore.prototype, 'loadUsers');
const spiedOnLoadMeetups = jest.spyOn(MeetupStore.prototype, 'loadMeetups');
const spiedOnLoadNews = jest.spyOn(NewsStore.prototype, 'loadNews');
const spiedOnUiStoreDestroy = jest.spyOn(UiStore.prototype, 'destroy');

describe('RootStore', () => {
  describe('constructor', () => {
    it('should initialize authStore field to a new AuthStore instance', () => {
      const rootStore = new RootStore();
      expect(rootStore.authStore).not.toBeNull();
      expect(rootStore.authStore instanceof AuthStore).toBe(true);
    });

    it('should initialize userStore field to a new UserStore instance', () => {
      const rootStore = new RootStore();
      expect(rootStore.userStore).not.toBeNull();
      expect(rootStore.userStore instanceof UserStore).toBe(true);
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
    it('should call UserStore loadUsers() method', async () => {
      const rootStore = new RootStore();
      await rootStore.init();
      expect(spiedOnLoadUsers).toHaveBeenCalled();
    });

    it('should call MeetupStore loadMeetups() method', async () => {
      const rootStore = new RootStore();
      await rootStore.init();
      expect(spiedOnLoadMeetups).toHaveBeenCalled();
    });

    it('should call NewsStore loadNews() method', async () => {
      const rootStore = new RootStore();
      await rootStore.init();
      expect(spiedOnLoadNews).toHaveBeenCalled();
    });

    it('should return the instance it was called on', async () => {
      const rootStore = new RootStore();
      const initializedRootStore = await rootStore.init();
      expect(initializedRootStore).toBe(rootStore);
    });
  });

  describe('destroy() instance method', () => {
    it('should call UiStore destroy() method', () => {
      const rootStore = new RootStore();
      rootStore.destroy();
      expect(spiedOnUiStoreDestroy).toHaveBeenCalled();
    });
  });
});
