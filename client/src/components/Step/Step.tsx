import classNames from 'classnames';

import { StepStatus } from 'components';

import styles from './Step.module.scss';
import check from './check.svg';

interface StepProps {
  status: StepStatus;
  title: string;
  stepNumber: number;
}

export const Step = ({ status, title, stepNumber }: StepProps) => {
  return (
    <div className={classNames(styles.step, styles[status])}>
      <div className={styles.number}>
        {status === StepStatus.Passed ? (
          <img src={check} alt="Шаг завершён" />
        ) : (
          stepNumber
        )}
      </div>
      {title}
    </div>
  );
};
