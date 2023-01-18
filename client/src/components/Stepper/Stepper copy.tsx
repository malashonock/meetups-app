import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StepperProgress } from 'components';

import styles from './Stepper.module.scss';

export enum StepStatus {
  Active = 'active',
  Available = 'available',
  Passed = 'passed',
  Disabled = 'disabled',
}

interface StepConfig<T> {
  title: string;
  render: (context: StepperContext<T>) => JSX.Element;
  noValidate?: boolean;
}

export interface StepState<T> extends StepConfig<T> {
  index: number;
  status: StepStatus;
  passed: boolean;
  visited: boolean;
}

export type StepperContext<T = unknown> = {
  dataContext: T;
  stepsState: StepState<T>[],
  activeStep: StepState<T>;
  setStepPassed: (index: number, state: boolean) => void;
  handleBack: () => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleFinish: () => void;
};

interface StepperProps<T extends unknown> {
  steps: StepConfig<T>[];
  dataContext: T;
  onFinish: () => void;
}

export const Stepper = <T extends unknown>({
  steps,
  onFinish: handleFinish,
  dataContext,
}: StepperProps<T>) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const [stepsState, setStepsState] = useState(
    steps.map((step: StepConfig<T>, index: number): StepState<T> =>
      Object.assign({}, step, {
        index,
        status: StepStatus.Disabled,
        passed: false,
        visited: false,
      }),
    ),
  );

  const activeStep: StepState<T> = stepsState[activeStepIndex];

  const changeActiveStepStatusBeforeLeave = (
    step: StepState<T>,
    index: number,
  ): StepState<T> => {
    if (index === activeStepIndex) {
      return {
        ...step,
        status: step.passed ? StepStatus.Passed : StepStatus.Available,
      };
    }

    return step;
  };

  const setStepPassed = (index: number, state: boolean): void => {
    setStepsState(
      stepsState.map((step: StepState<T>, i: number): StepState<T> => {
        if (i === index) {
          step.passed = state;

          /* Set appropriate variant to next steps (if they exist) if current step is passed */
          if (stepsState[i + 1] && state)
            for (
              let nextStepIndex = i + 1;
              nextStepIndex < stepsState.length;
              nextStepIndex++
            ) {
              const nextStep = stepsState[nextStepIndex];
              nextStep.status = nextStep.passed
                ? StepStatus.Passed
                : nextStep.visited || nextStepIndex === i + 1
                  ? StepStatus.Available
                  : StepStatus.Disabled;
            }

          /* Set disabled variant to next steps (if they exist) if current step is not passed */
          if (stepsState[i + 1] && !state)
            for (
              let nextStepIndex = i + 1;
              nextStepIndex < stepsState.length;
              nextStepIndex++
            ) {
              stepsState[nextStepIndex].status = StepStatus.Disabled;
            }

          return step;
        }

        return step;
      }),
    );
  };

  useEffect(() => {
    if (activeStep.noValidate) {
      setStepPassed(activeStepIndex, true);
    }

    setStepsState(
      stepsState.map((step: StepState<T>, i: number): StepState<T> =>
        i === activeStepIndex
          ? { 
            ...step,
            status: StepStatus.Active,
            visited: true, 
          }
          : step,
      ),
    );
  }, [activeStepIndex]);

  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const handleNextStep = () => {
    const nextStepIndex = activeStepIndex + 1;
    if (nextStepIndex <= steps.length) {
      setStepsState(
        stepsState.map(changeActiveStepStatusBeforeLeave),
      );

      setActiveStepIndex(nextStepIndex);
    }
  };

  const handlePreviousStep = () => {
    const previousStepIndex = activeStepIndex - 1;
    if (previousStepIndex >= 0) {
      setStepsState(
        stepsState.map(changeActiveStepStatusBeforeLeave),
      );

      setActiveStepIndex(previousStepIndex);
    }
  };

  const stepperContext: StepperContext<T> = {
    dataContext,
    stepsState,
    activeStep,
    setStepPassed,
    handleBack,
    handleNextStep,
    handlePreviousStep,
    handleFinish,
  };

  return (
    <div className={styles.stepper}>
      <StepperProgress {...stepperContext} />
      <div className={styles.stepperBody}>
        {steps[activeStepIndex].render(stepperContext)}
      </div>
    </div>
  );
};
