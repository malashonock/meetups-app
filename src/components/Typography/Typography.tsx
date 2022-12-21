import classNames from 'classnames';

import {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  useMemo,
} from 'react';

import styles from './Typography.module.scss';

export type TypographySelector = 'heading' | 'paragraph' | 'other';

const headingMapping: Record<string, HTMLElementName> = {
  'fs-xl': 'h1',
  'fs-l': 'h2',
  'fs-m': 'h3',
  'fs-s': 'h4',
  'fs-xs': 'h5',
};

type HTMLElementName = keyof JSX.IntrinsicElements;

type HTMLElement<TElementName extends HTMLElementName> =
  JSX.IntrinsicElements[TElementName] extends DetailedHTMLProps<
    infer TAttributes,
    infer TElement
  >
    ? TElement
    : never;

type TypographyProps = {
  variant?: TypographySelector;
} & PropsWithChildren &
  HTMLAttributes<unknown>;

export const Typography = ({
  variant = 'other',
  children,
  ...nativeHtmlProps
}: TypographyProps): JSX.Element => {
  const Component = useMemo(() => {
    switch (variant) {
      case 'heading':
        const { className } = nativeHtmlProps;
        const fontSizeClasses = className
          ?.split(' ')
          .filter((cls) => cls.startsWith('fs-'));
        const lastFontSizeClass =
          fontSizeClasses && fontSizeClasses.length > 0
            ? fontSizeClasses.reverse()[0]
            : 'fs-m';
        return headingMapping[lastFontSizeClass] ?? 'h3';
      case 'paragraph':
      default:
        return 'p';
      case 'other':
        return 'span';
    }
  }, [nativeHtmlProps, variant]);

  return (
    <Component
      {...(nativeHtmlProps as HTMLAttributes<HTMLElement<typeof Component>>)}
      className={classNames(
        styles.typography,
        variant,
        nativeHtmlProps.className,
      )}
    >
      {children}
    </Component>
  );
};
