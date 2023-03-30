import { useEffect } from 'react';

export const useOnKeyDown = (key: string, effect: () => void): void => {
  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (event.key === key) {
        effect();
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [effect, key]);
};
