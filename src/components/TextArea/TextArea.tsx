import { AllHTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './TextArea.module.scss';

type TextAreaProps = {
  maxLetterCount?: number;
} & AllHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = ({
  maxLetterCount,
  ...nativeHtmlProps
}: TextAreaProps): JSX.Element => {
  const letterCount = !!nativeHtmlProps.value
    ? nativeHtmlProps.value.toString().length
    : '0';

  return (
    <div className={styles.container}>
      <textarea
        {...nativeHtmlProps}
        maxLength={maxLetterCount}
        className={classNames(
          nativeHtmlProps.className,
          styles.textArea,
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
