import { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';

import { useLocale } from 'hooks';
import { Locale, RootStore } from 'stores';
import { RootContext } from 'components';

const mockRootStore = new RootStore();

const MockRootStoreProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  return (
    <RootContext.Provider value={mockRootStore}>
      {children}
    </RootContext.Provider>
  );
};

describe('useLocale hook', () => {
  describe('given root context is not yet set up', () => {
    it('should return a tuple with undefined locale and setLocale function', () => {
      const { result } = renderHook(() => useLocale());

      expect(result.current.length).toBe(2);
      const [locale, setLocale] = result.current;

      expect(locale).toBeUndefined();
      expect(typeof setLocale).toBe('function');
    });

    describe('setLocale() function', () => {
      it('should not update locale', () => {
        const { result, rerender } = renderHook(() => useLocale());
        const [originalLocale, originalSetLocale] = result.current;

        act(() => {
          originalSetLocale(Locale.EN);
        });

        rerender();
        const [updatedLocale, updatedSetLocale] = result.current;

        expect(updatedLocale).toBeUndefined();
      });
    });
  });

  describe('given root context is set up', () => {
    it('should return a tuple with default locale and setLocale function', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: MockRootStoreProvider,
      });

      expect(result.current.length).toBe(2);
      const [locale, setLocale] = result.current;

      expect(locale).toBe(Locale.RU);
      expect(typeof setLocale).toBe('function');
    });

    describe('setLocale() function', () => {
      it('should update locale', () => {
        const { result, rerender } = renderHook(() => useLocale(), {
          wrapper: MockRootStoreProvider,
        });
        const [originalLocale, originalSetLocale] = result.current;

        expect(originalLocale).toBe(Locale.RU);

        act(() => {
          originalSetLocale(Locale.EN);
        });

        rerender();
        const [updatedLocale, updatedSetLocale] = result.current;

        expect(updatedLocale).toBe(Locale.EN);
        expect(originalSetLocale).not.toBe(updatedSetLocale);
      });
    });
  });
});
