import { AllHTMLAttributes, useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './TextArea.module.scss';

export type TextAreaProps = {
  maxCharCount?: number;
  showCharCounter?: boolean;
} & AllHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = ({
  maxCharCount,
  showCharCounter = false,
  ...nativeHtmlProps
}: TextAreaProps): JSX.Element => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const value = textAreaRef.current?.value;

  // Auto-adjust height of textarea
  useEffect(() => {
    if (textAreaRef.current) {
      const { current: textArea } = textAreaRef;

      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textArea.style.height = 'auto';

      // We also need to take account of border width, because scrollHeight doesn't include it
      const borderWidth = +getComputedStyle(textArea).borderWidth.replace(
        'px',
        '',
      );

      const { scrollHeight } = textArea;
      const textAreaHeight = scrollHeight + 2 * borderWidth;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textArea.style.height = textAreaHeight + 'px';
    }
  }, [textAreaRef.current, value]);

  const charCount = value?.toString().length ?? 0;

  return (
    <div className={styles.container}>
      <textarea
        {...nativeHtmlProps}
        ref={textAreaRef}
        rows={1}
        maxLength={maxCharCount}
        className={classNames(nativeHtmlProps.className, styles.textArea, {
          [styles.showCharCounter]: showCharCounter,
        })}
        data-testid="text-area"
      ></textarea>
      {showCharCounter && maxCharCount && maxCharCount > 0 && (
        <div className={styles.charCounter} data-testid="char-counter">
          <span className={styles.charCount}>{charCount}</span> / {maxCharCount}
        </div>
      )}
    </div>
  );
};
