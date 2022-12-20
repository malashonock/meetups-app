import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

type TypographySelector =
  | 'h1--f1'
  | 'h2--f1'
  | 'h3--f1'
  | 'h4--f1'
  | 'h2--f2'
  | 'h3--f2'
  | 'h4--f2'
  | 'subtitle'
  | 'nav'
  | 'body--s'
  | 'body--xs'
  | 'btn-text--primary'
  | 'btn-text--secondary'
  | 'btn-text--default'
  | 'placeholder--default'
  | 'placeholder--focus'
  | 'placeholder--active'
  | 'label'
  | 'paragraph--c1'
  | 'paragraph--c2'
  | 'paragraph--c3';

const variantMapping: Record<TypographySelector, HTMLElementName> = {
  'h1--f1': 'h1',
  'h2--f1': 'h2',
  'h3--f1': 'h3',
  'h4--f1': 'h4',
  'h2--f2': 'h2',
  'h3--f2': 'h3',
  'h4--f2': 'h4',
  subtitle: 'h6',
  nav: 'span',
  'body--s': 'p',
  'body--xs': 'p',
  'btn-text--primary': 'span',
  'btn-text--secondary': 'span',
  'btn-text--default': 'span',
  'placeholder--default': 'span',
  'placeholder--focus': 'span',
  'placeholder--active': 'span',
  label: 'span',
  'paragraph--c1': 'p',
  'paragraph--c2': 'p',
  'paragraph--c3': 'p',
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
  variant: TypographySelector;
} & PropsWithChildren &
  HTMLAttributes<unknown>;

export const Typography = ({
  variant,
  children,
  ...nativeHtmlProps
}: TypographyProps): JSX.Element => {
  const elementName = variantMapping[variant];
  const Component = elementName;
  return (
    <Component
      {...(nativeHtmlProps as HTMLAttributes<HTMLElement<typeof elementName>>)}
      className={classNames(nativeHtmlProps.className, variant)}
    >
      {children}
    </Component>
  );
};
