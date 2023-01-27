import { makeObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { RootStore } from 'stores';

export enum Locale {
  RU = 'ru',
  EN = 'en',
}

export class UiStore {
  locale: Locale;
  showOverlay: boolean;

  constructor(public rootStore: RootStore) {
    makeObservable(this, {
      locale: observable,
      showOverlay: observable,
    });

    makePersistable(this, {
      name: 'ui',
      properties: ['locale', 'showOverlay'],
      storage: window.localStorage,
    });

    this.locale = Locale.RU;
    this.showOverlay = false;
  }
}
