import {
  TabsIndicator,
  Step,
  StepperContext,
  StepState,
} from 'components';

import styles from './StepperProgress.module.scss';

export const StepperProgress = <T extends unknown>({
  stepsState,
  activeStep,
}: StepperContext<T>): JSX.Element => {

  return (
    <div className={styles.stepperProgress}>
      <div className={styles.steps}>
        {stepsState.map(
          ({ title, status }: StepState<T>, stepIndex: number) => (
            <Step
              key={title}
              title={title}
              status={status}
              stepNumber={stepIndex + 1}
            />
          ),
        )}
      </div>
      <TabsIndicator
        tabsCount={stepsState.length}
        activeTabIndex={activeStep.index}
      />
    </div>
  );
};
