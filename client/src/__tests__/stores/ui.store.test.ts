import { makePersistable, stopPersisting } from 'mobx-persist-store';

import { UiStore, RootStore, Locale } from 'stores';

jest.mock('mobx-persist-store', () => ({
  makePersistable: jest.fn(),
  stopPersisting: jest.fn(),
}));
const mockMobXMakePersistable = makePersistable as jest.MockedFunction<
  typeof makePersistable
>;
const mockMobXStopPersisting = stopPersisting as jest.MockedFunction<
  typeof stopPersisting
>;

describe('UiStore', () => {
  describe('constructor', () => {
    it('should make the returned store persistable', () => {
      const defaultOptions = {
        name: 'ui',
        properties: ['locale', 'showOverlay'],
        storage: window.localStorage,
      };
      const uiStore = new UiStore(new RootStore());
      expect(mockMobXMakePersistable).toHaveBeenCalledWith(
        uiStore,
        defaultOptions,
      );
    });

    it('should initialize locale field to ru-RU', () => {
      const uiStore = new UiStore(new RootStore());
      expect(uiStore.locale).toBe(Locale.RU);
    });

    it('should initialize showOverlay field to false', () => {
      const uiStore = new UiStore(new RootStore());
      expect(uiStore.showOverlay).toBe(false);
    });
  });
});
