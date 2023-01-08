import { PropsWithChildren, useContext } from 'react';

import {
  StepperContext,
  StepperContextType,
  Button,
  ButtonVariant,
} from 'components';

import styles from './StepContent.module.scss';

interface StepContentProps {
  step: number;
  currentStep: number;
  isLast: boolean;
  isFirst: boolean;
}

export const StepContent = ({
  isFirst,
  isLast,
  step,
  children,
}: PropsWithChildren<StepContentProps>) => {
  const { stepsDescriptor, handleFinish, handleNextStep, handlePreviousStep } =
    useContext(StepperContext) as StepperContextType;

  return (
    <div className={styles.step}>
      <div className={styles.stepBody}>{children}</div>
      <div className={styles.stepActions}>
        <Button
          disabled={isFirst}
          onClick={handlePreviousStep}
          variant={ButtonVariant.Default}
        >
          Назад
        </Button>

        {isLast ? (
          <Button
            onClick={handleFinish}
            variant={ButtonVariant.Primary}
            disabled={!stepsDescriptor[step].confirmed}
          >
            Создать
          </Button>
        ) : (
          <Button
            onClick={handleNextStep}
            variant={ButtonVariant.Primary}
            disabled={!stepsDescriptor[step].confirmed}
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
};
