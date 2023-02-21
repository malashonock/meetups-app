/* Borrowed from https://loading.io/css/ */
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Typography } from 'components';
import { generateArray } from 'utils';
import { Maybe } from 'types';

import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  text?: Maybe<string>;
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps): JSX.Element => {
  const { t } = useTranslation();

  const loadingText = (text ?? t('loadingText.default'))?.replace(/(\.)*$/, '');
  const appendEllipsis: boolean =
    !loadingText || loadingText.slice(-3) !== '...';

  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} data-testid="loading-spinner">
        {generateArray(
          12,
          (index: number): JSX.Element => (
            <div key={index} className={styles.circle} />
          ),
        )}
      </div>
      <Typography
        className={classNames(styles.text, {
          [styles.withEllipsis]: appendEllipsis,
          [styles.blank]: !loadingText,
        })}
      >
        {loadingText}
      </Typography>
    </div>
  );
};
