/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */

import { observer } from 'mobx-react-lite';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RootContext, RootStoreProvider } from 'components';
import { RootStore, Locale } from 'stores';
import { useContext } from 'react';

const mockRootStoreInit = jest
  .spyOn(RootStore.prototype, 'init')
  .mockImplementation(function doNothing(this: RootStore): Promise<RootStore> {
    return Promise.resolve(this);
  });

const mockRootStoreDestroy = jest.spyOn(RootStore.prototype, 'destroy');

// Mock useTranslation
const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

const TestChildComponent = observer((): JSX.Element => {
  const rootStore = useContext(RootContext);
  const locale = rootStore?.uiStore.locale;

  const changeLocale = () => {
    if (rootStore) {
      rootStore.uiStore.locale = locale === Locale.EN ? Locale.RU : Locale.EN;
    }
  };

  return (
    <div>
      <p>{rootStore?.uiStore.locale}</p>;
      <button onClick={changeLocale}>Change locale</button>
    </div>
  );
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('RootStoreProvider', () => {
  it('should initialize root store on mount', async () => {
    render(<RootStoreProvider />);

    await waitFor(() => {
      expect(mockRootStoreInit).toHaveBeenCalledTimes(1);
    });
  });

  it('should destroy root store on unmount', async () => {
    const { unmount } = render(<RootStoreProvider />);

    await waitFor(() => {
      unmount();
      expect(mockRootStoreDestroy).toHaveBeenCalledTimes(1);
    });
  });

  it('should provide a RootStore instance within child components', async () => {
    render(
      <RootStoreProvider>
        <TestChildComponent />
      </RootStoreProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('ru-RU')).toBeInTheDocument();
    });
  });

  it('should call i18n.changeLanguage() method on uiStore.locale change', async () => {
    render(
      <RootStoreProvider>
        <TestChildComponent />
      </RootStoreProvider>,
    );

    await waitFor(async () => {
      expect(screen.getByText('ru-RU')).toBeInTheDocument();

      userEvent.click(screen.getByText('Change locale'));

      await waitFor(() => {
        expect(screen.getByText('en-US')).toBeInTheDocument();
        expect(mockChangeLanguage).toHaveBeenCalledWith(Locale.RU);
      });
    });
  });
});
