import '../src/style/index.scss';
import i18n from '../src/i18n';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#ffffff',
      },
      {
        name: 'purple',
        value: '#8065ec',
      },
    ],
  },
  i18n,
  locale: 'ru',
  locales: {
    en: 'English',
    ru: 'Русский',
  },
};
