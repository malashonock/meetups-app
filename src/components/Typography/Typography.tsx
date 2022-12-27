import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

import styles from './Typography.module.scss';

export type TypographySelector = 'heading' | 'paragraph' | 'other';

const headingMapping: Record<string, HTMLElementName> = {
  'font-size-xl': 'h1',
  'font-size-l': 'h2',
  'font-size-m': 'h3',
  'font-size-s': 'h4',
  'font-size-xs': 'h5',
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
  const getComponent = () => {
    switch (variant) {
      case 'heading':
        const { className } = nativeHtmlProps;
        const fontSizeClasses = className
          ?.split(' ')
          .filter((cls) => cls.startsWith('font-size-'));
        const lastFontSizeClass =
          fontSizeClasses && fontSizeClasses.length > 0
            ? fontSizeClasses.reverse()[0]
            : 'font-size-m';
        return headingMapping[lastFontSizeClass] ?? 'h3';
      case 'other':
        return 'span';
      case 'paragraph':
      default:
        return 'p';
    }
  };

  const Component = getComponent();

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
