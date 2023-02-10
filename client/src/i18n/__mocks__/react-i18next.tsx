import { PropsWithChildren } from 'react';

export const useTranslation = () => ({
  t: (key: string) => key,
  i18n: {
    t: (key: string) => key,
    changeLanguage: () => new Promise(() => {}),
  },
});

export const Trans = ({ children }: PropsWithChildren): JSX.Element => (
  <>{children}</>
);

export const initReactI18next = {
  type: '3rdParty',
  init: () => {},
};
