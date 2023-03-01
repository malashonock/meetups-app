import { makeAutoObservable } from 'mobx';
import { UiStore } from 'stores';

export enum AlertSeverity {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export interface AlertProps {
  severity: AlertSeverity;
  title: string;
  text: string;
  expiresIn?: number; // milliseconds
}

export class Alert {
  uiStore: UiStore;
  severity: AlertSeverity;
  title: string;
  text: string;

  static DefaultTimeout = 3_000;

  constructor(props: AlertProps, uiStore: UiStore) {
    makeAutoObservable(this);
    this.uiStore = uiStore;

    ({ severity: this.severity, title: this.title, text: this.text } = props);

    setTimeout(() => this.dismiss(), props.expiresIn ?? Alert.DefaultTimeout);
  }

  dismiss(): void {
    this.uiStore.onAlertDismissed(this);
  }

  toJSON() {
    return {
      severity: this.severity,
      title: this.title,
      text: this.text,
    };
  }
}
