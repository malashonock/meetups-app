import { makePersistable } from 'mobx-persist-store';

import { UiStore, RootStore, Locale } from 'stores';
import { Alert, AlertSeverity } from 'types';

jest.mock('mobx-persist-store', () => ({
  makePersistable: jest.fn(),
}));
const mockMobXMakePersistable = makePersistable as jest.MockedFunction<
  typeof makePersistable
>;

describe('UiStore', () => {
  describe('constructor', () => {
    it('should make the returned store persistable', () => {
      const defaultOptions = {
        name: 'ui',
        properties: ['locale'],
        storage: window.localStorage,
      };
      const uiStore = new UiStore(new RootStore());
      expect(mockMobXMakePersistable).toHaveBeenCalledWith(
        uiStore,
        defaultOptions,
      );
    });

    it('should initialize instance fields properly', () => {
      const uiStore = new UiStore(new RootStore());
      expect(uiStore.locale).toBe(Locale.RU);
      expect(uiStore.alerts.length).toBe(0);
    });
  });

  describe('setLocale() instance method', () => {
    it('should set the value of the locale field correctly', () => {
      const uiStore = new UiStore(new RootStore());
      uiStore.setLocale(Locale.EN);
      expect(uiStore.locale).toBe(Locale.EN);
    });
  });

  describe('onAlertCreated() instance method', () => {
    it('should push new alert to the alerts array', () => {
      const uiStore = new UiStore(new RootStore());
      const alert = new Alert(
        {
          severity: AlertSeverity.Error,
          text: 'An error occurred',
        },
        uiStore,
      );
      uiStore.onAlertCreated(alert);
      expect(uiStore.alerts.length).toBe(1);
      expect(uiStore.alerts[0]).toStrictEqual(alert);
    });

    it('should not push an already existing alert to the alerts array', () => {
      const uiStore = new UiStore(new RootStore());
      const alert = new Alert(
        {
          severity: AlertSeverity.Error,
          text: 'An error occurred',
        },
        uiStore,
      );
      uiStore.onAlertCreated(alert);
      uiStore.onAlertCreated(alert);
      expect(uiStore.alerts.length).toBe(1);
      expect(uiStore.alerts[0]).toStrictEqual(alert);
    });
  });

  describe('onAlertDismissed() instance method', () => {
    it('should remove an existing alert from the alerts array', () => {
      const uiStore = new UiStore(new RootStore());
      const alert = new Alert(
        {
          severity: AlertSeverity.Error,
          text: 'An error occurred',
        },
        uiStore,
      );
      uiStore.onAlertCreated(alert);
      uiStore.onAlertDismissed(alert);
      expect(uiStore.alerts.length).toBe(0);
    });

    it("should not throw if an attempt is made to delete an alert that doesn't exist in the alerts array", () => {
      const uiStore = new UiStore(new RootStore());
      const alert = new Alert(
        {
          severity: AlertSeverity.Error,
          text: 'An error occurred',
        },
        uiStore,
      );
      expect(() => uiStore.onAlertDismissed(alert)).not.toThrow();
      expect(uiStore.alerts.length).toBe(0);
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize only the locale field', () => {
      const uiStore = new UiStore(new RootStore());
      expect(JSON.stringify(uiStore)).toBe(
        JSON.stringify({
          locale: Locale.RU,
        }),
      );
    });
  });
});
