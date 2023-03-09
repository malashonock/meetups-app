import * as MobX from 'mobx';
import { RootStore, UiStore } from 'stores';

import { Alert, AlertSeverity } from 'types';

const spiedOnMobxMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');

const ALERT_SEVERITY = AlertSeverity.Error;
const ALERT_TITLE = 'Failure!';
const ALERT_TEXT = 'An error occurred';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('Alert class', () => {
  describe('constructor', () => {
    it('should make the created instance observable', () => {
      const alert = new Alert(
        {
          severity: AlertSeverity.Error,
          text: 'An error occurred',
        },
        new RootStore().uiStore,
      );
      expect(spiedOnMobxMakeAutoObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
      const alert = new Alert(
        {
          severity: ALERT_SEVERITY,
          title: ALERT_TITLE,
          text: ALERT_TEXT,
        },
        new RootStore().uiStore,
      );

      expect(alert.severity).toBe(AlertSeverity.Error);
      expect(alert.title).toBe(ALERT_TITLE);
      expect(alert.text).toBe(ALERT_TEXT);
    });

    describe('dismissal countdown timer', () => {
      describe('given expiresIn arg is passed', () => {
        it('should be set up to expire in specified time', () => {
          const alert = new Alert(
            {
              severity: ALERT_SEVERITY,
              text: ALERT_TEXT,
              expiresIn: 5_000,
            },
            new RootStore().uiStore,
          );
          const spiedOnDismiss = jest.spyOn(alert, 'dismiss');

          jest.advanceTimersByTime(3_000);
          expect(spiedOnDismiss).not.toHaveBeenCalled();

          jest.advanceTimersByTime(2_000);
          expect(spiedOnDismiss).toHaveBeenCalledTimes(1);
        });
      });

      describe('given expiresIn arg is not passed', () => {
        it('should be set up to expire in default time', () => {
          const alert = new Alert(
            {
              severity: ALERT_SEVERITY,
              text: ALERT_TEXT,
            },
            new RootStore().uiStore,
          );
          const spiedOnDismiss = jest.spyOn(alert, 'dismiss');
          expect(spiedOnDismiss).not.toHaveBeenCalled();

          jest.advanceTimersByTime(3_000);
          expect(spiedOnDismiss).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('dismiss() instance method', () => {
    it("should call the UI store's onAlertDismissed() method", () => {
      const uiStore = new RootStore().uiStore;
      const spiedOnOnAlertDismissed = jest.spyOn(uiStore, 'onAlertDismissed');
      const alert = new Alert(
        {
          severity: ALERT_SEVERITY,
          text: ALERT_TEXT,
        },
        uiStore,
      );

      alert.dismiss();
      expect(spiedOnOnAlertDismissed).toHaveBeenCalled();
    });
  });

  describe('toJSON() instance method', () => {
    it('should serialize correctly', () => {
      const alert = new Alert(
        {
          severity: ALERT_SEVERITY,
          title: ALERT_TITLE,
          text: ALERT_TEXT,
        },
        new RootStore().uiStore,
      );

      expect(JSON.stringify(alert)).toBe(
        JSON.stringify({
          severity: ALERT_SEVERITY,
          title: ALERT_TITLE,
          text: ALERT_TEXT,
        }),
      );
    });
  });
});
