import { useContext } from 'react';
import {
  TabsIndicator,
  Step,
  StepperContext,
  StepperContextType,
  StepDescriptor,
} from 'components';

import styles from './StepperProgress.module.scss';

interface StepperProgressProps {
  currentStep: number;
}

export const StepperProgress = ({ currentStep }: StepperProgressProps) => {
  const { stepsDescriptor, setStepsDescriptor } = useContext(
    StepperContext,
  ) as StepperContextType;

  return (
    <div className={styles['stepper-progress']}>
      <div className={styles.steps}>
        {stepsDescriptor.map(
          (step: StepDescriptor, i: number): JSX.Element => (
            <Step
              key={step.title}
              variant={step.variant}
              title={step.title}
              number={i + 1}
            ></Step>
          ),
        )}
      </div>
      <TabsIndicator
        tabsAmount={stepsDescriptor.length}
        currentTab={currentStep}
      />
    </div>
  );
};
