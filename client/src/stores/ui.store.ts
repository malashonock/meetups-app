import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { RootStore } from 'stores';
import { Alert } from 'types';

export enum Locale {
  RU = 'ru-RU',
  EN = 'en-US',
}

export class UiStore {
  locale: Locale;
  alerts: Alert[];

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'ui',
      properties: ['locale'],
      storage: window.localStorage,
    });

    this.locale = Locale.RU;
    this.alerts = [];
  }

  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  onAlertCreated(newAlert: Alert): void {
    const isAlreadyRegistered = this.alerts.some(
      (alert): boolean => JSON.stringify(alert) === JSON.stringify(newAlert),
    );
    if (!isAlreadyRegistered) {
      this.alerts.push(newAlert);
    }
  }

  onAlertDismissed(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(
      (alert: Alert): boolean =>
        JSON.stringify(alert) !== JSON.stringify(dismissedAlert),
    );
  }

  toJSON() {
    return {
      locale: this.locale,
    };
  }
}
