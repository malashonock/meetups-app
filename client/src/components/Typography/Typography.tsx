import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

import styles from './Typography.module.scss';

export enum TypographyComponent {
  Heading1 = 'h1',
  Heading2 = 'h2',
  Heading3 = 'h3',
  Heading4 = 'h4',
  Heading5 = 'h5',
  Heading6 = 'h6',
  Paragraph = 'p',
  Span = 'span',
}

type HTMLElementName = keyof JSX.IntrinsicElements;

/* eslint-disable @typescript-eslint/no-unused-vars */
type HTMLElement<TElementName extends HTMLElementName> =
  JSX.IntrinsicElements[TElementName] extends DetailedHTMLProps<
    infer TAttributes,
    infer TElement
  >
    ? TElement
    : never;
/* eslint-enable @typescript-eslint/no-unused-vars */

type TypographyProps = {
  component?: TypographyComponent;
  noWrap?: boolean;
} & PropsWithChildren &
  HTMLAttributes<unknown>;

export const Typography = ({
  component = TypographyComponent.Span,
  noWrap = false,
  children,
  ...nativeHtmlProps
}: TypographyProps): JSX.Element => {
  const Component = component;

  return (
    <Component
      {...(nativeHtmlProps as HTMLAttributes<HTMLElement<typeof Component>>)}
      className={classNames(
        styles.typography,
        component,
        nativeHtmlProps.className,
        { [styles.noWrap]: noWrap },
      )}
    >
      {children}
    </Component>
  );
};
