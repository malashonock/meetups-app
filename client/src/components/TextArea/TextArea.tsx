import { AllHTMLAttributes, useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './TextArea.module.scss';

type TextAreaProps = {
  maxLetterCount?: number;
} & AllHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = ({
  maxLetterCount,
  ...nativeHtmlProps
}: TextAreaProps): JSX.Element => {
  const { value, className } = nativeHtmlProps;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust height of textarea
  useEffect(() => {
    if (textAreaRef.current) {
      const { current: textArea } = textAreaRef;

      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textArea.style.height = 'auto';
      const scrollHeight = textArea.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textArea.style.height = scrollHeight + 'px';
    }
  }, [textAreaRef.current, value]);

  const letterCount = value?.toString().length ?? 0;

  return (
    <div className={styles.container}>
      <textarea
        {...nativeHtmlProps}
        ref={textAreaRef}
        rows={1}
        maxLength={maxLetterCount}
        className={classNames(
          className,
          styles.textArea,
        )}
      ></textarea>
      {maxLetterCount && maxLetterCount > 0 && (
        <div className={styles.counter}>
          <span className={styles.letterCount}>{letterCount}</span> /{' '}
          {maxLetterCount}
        </div>
      )}
    </div>
  );
};
