import classNames from 'classnames';

import { StepVariant } from 'components';

import styles from './Step.module.scss';
import check from './check.svg';

interface StepProps {
  variant: StepVariant;
  title: string;
  stepNumber: number;
}

export const Step = ({ variant, title, stepNumber }: StepProps) => {
  return (
    <div className={classNames(styles.step, styles[variant])}>
      <div className={styles.number}>
        {variant === StepVariant.Confirmed ? (
          <img src={check} alt="Шаг завершён" />
        ) : (
          stepNumber
        )}
      </div>
      {title}
    </div>
  );
};
