import { PropsWithChildren, useContext } from 'react';

import {
  StepperContext,
  StepperContextType,
  Button,
  ButtonVariant,
} from 'components';

import styles from './StepContent.module.scss';

export interface StepProps {
  currentStep: number;
  isLast: boolean;
  isFirst: boolean;
}

export const StepContent = ({
  isFirst,
  isLast,
  currentStep,
  children,
}: PropsWithChildren<StepProps>) => {
  const {
    stepsDescriptor,
    setStepsDescriptor,
    handleCreate,
    handleNextStep,
    handlePreviousStep,
  } = useContext(StepperContext) as StepperContextType;

  return (
    <div className={styles['step']}>
      <div className={styles['step-body']}>{children}</div>
      <div className={styles['step-actions']}>
        <Button
          disabled={isFirst}
          onClick={handlePreviousStep}
          variant={ButtonVariant.Default}
        >
          Назад
        </Button>

        {isLast ? (
          <Button onClick={handleCreate} variant={ButtonVariant.Primary}>
            Создать
          </Button>
        ) : (
          <Button
            onClick={handleNextStep}
            variant={ButtonVariant.Primary}
            // disabled={
            //   stepsDescriptor[currentStep + 1].variant === StepVariant.Disabled
            // }
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
};
