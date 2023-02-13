import classNames from 'classnames';

import { StepStatus } from 'components';

import styles from './Step.module.scss';
import check from './check.svg';
import { useTranslation } from 'react-i18next';

interface StepProps {
  status: StepStatus;
  title: string;
  stepNumber: number;
}

export const Step = ({ status, title, stepNumber }: StepProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(styles.step, styles[status])}
      data-testid={`step-${stepNumber}`}
    >
      <div className={styles.number} data-testid={`step-${stepNumber}-circle`}>
        {status === StepStatus.Passed ? (
          <img
            data-testid={`step-${stepNumber}-tick`}
            src={check}
            alt={t('stepper.passedImgAlt') || 'Step completed'}
          />
        ) : (
          stepNumber
        )}
      </div>
      {title}
    </div>
  );
};
