import { RefObject, useEffect, useLayoutEffect, useState } from 'react';

export const useResizeEffect = <T extends HTMLElement>(
  containerRef: RefObject<T>,
  effect: (containerWidth: number, containerHeight: number) => void,
  externalDeps: unknown[] = [],
) => {
  const [containerWidth, setContainerWidth] = useState(
    containerRef.current?.clientWidth || 0,
  );
  const [containerHeight, setContainerHeight] = useState(
    containerRef.current?.clientHeight || 0,
  );

  // sync container width on resize
  useEffect(() => {
    const updateContainerSize = (): void => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current?.clientWidth);
        setContainerHeight(containerRef.current?.clientHeight);
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return (): void =>
      window.removeEventListener('resize', updateContainerSize);
  }, [containerRef]);

  // run effect on container resize
  /* eslint-disable react-hooks/exhaustive-deps */
  useLayoutEffect((): void => {
    effect(containerWidth, containerHeight);
  }, [effect, containerWidth, containerHeight, ...externalDeps]);
  /* eslint-enable react-hooks/exhaustive-deps */
};
