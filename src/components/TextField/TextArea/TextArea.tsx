import { AllHTMLAttributes } from 'react';
import classNames from 'classnames';

import { TextFieldVariant } from 'components';

import styles from './TextArea.module.scss';

type TextAreaProps = {
  variant: TextFieldVariant;
  maxLetterCount?: number;
} & AllHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = ({
  variant,
  maxLetterCount,
  ...nativeHtmlProps
}: TextAreaProps): JSX.Element => {
  const letterCount = !!nativeHtmlProps.value
    ? nativeHtmlProps.value.toString().length
    : '0';

  return (
    <div className={styles.wrapper}>
      <textarea
        {...nativeHtmlProps}
        maxLength={maxLetterCount}
        aria-disabled
        className={classNames(
          nativeHtmlProps.className,
          styles.textArea,
          styles[variant],
        )}
      ></textarea>
      {!!maxLetterCount && (
        <div className={styles.counter}>
          <span className={styles.letterCount}>{letterCount}</span> /{' '}
          {maxLetterCount}
        </div>
      )}
    </div>
  );
};
