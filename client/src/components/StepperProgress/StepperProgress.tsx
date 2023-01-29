import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { TabsIndicator, Step, StepperContext, StepState } from 'components';

import styles from './StepperProgress.module.scss';

export const StepperProgress = observer(
  <T extends unknown>({
    stepsState,
    activeStep,
  }: StepperContext<T>): JSX.Element => {
    const { i18n } = useTranslation();

    return (
      <div className={styles.stepperProgress}>
        <div className={styles.steps}>
          {stepsState.map(
            ({ title, status }: StepState<T>, stepIndex: number) => (
              <Step
                key={title(i18n)}
                title={title(i18n)}
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
  },
);
