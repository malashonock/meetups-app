import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { RootStore } from 'stores';

export enum Locale {
  RU = 'ru-RU',
  EN = 'en-US',
}

export class UiStore {
  locale: Locale;
  showOverlay: boolean;

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'ui',
      properties: ['locale', 'showOverlay'],
      storage: window.localStorage,
    });

    this.locale = Locale.RU;
    this.showOverlay = false;
  }

  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  toJSON() {
    return {
      locale: this.locale,
      this: this.showOverlay,
    };
  }
}
