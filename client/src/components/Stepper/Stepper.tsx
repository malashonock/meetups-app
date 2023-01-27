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

export interface StepConfig<T> {
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
  stepsState: StepState<T>[];
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
  const [passedStepsIndices, setPassedStepsIndices] = useState<number[]>([]);

  const [stepsState, setStepsState] = useState(
    steps.map(
      (step: StepConfig<T>, index: number): StepState<T> =>
        Object.assign({}, step, {
          index,
          status: StepStatus.Disabled,
          passed: false,
          visited: false,
        }),
    ),
  );

  const activeStep: StepState<T> = stepsState[activeStepIndex];

  // mark as passed visited steps that don't require validation
  useEffect(() => {
    if (activeStep.noValidate && !activeStep.passed) {
      setStepPassed(activeStepIndex, true);
    }
  }, [activeStepIndex]);

  // sync steps state with changes in active step selection or validation status
  const updateStepState = (stepState: StepState<T>): StepState<T> => {
    const { index, noValidate } = stepState;

    const active = index === activeStepIndex;
    const visited = stepState.visited || active;
    const passed =
      (visited && noValidate) || passedStepsIndices.includes(index);

    const status = active
      ? StepStatus.Active
      : passed
      ? StepStatus.Passed
      : index === activeStepIndex + 1 &&
        passedStepsIndices.includes(activeStepIndex)
      ? StepStatus.Available
      : StepStatus.Disabled;

    return {
      ...stepState,
      status,
      passed,
      visited,
    };
  };

  useEffect((): void => {
    const updatedStepsState = stepsState.map(updateStepState);
    setStepsState([...updatedStepsState]);
  }, [activeStepIndex, passedStepsIndices]);

  const setStepPassed = (index: number, state: boolean): void => {
    switch (state) {
      case true:
        if (!passedStepsIndices.includes(index)) {
          setPassedStepsIndices([...passedStepsIndices, index]);
        }
        break;
      case false:
        if (passedStepsIndices.includes(index)) {
          setPassedStepsIndices(
            passedStepsIndices.filter(
              (passedStepIndex) => passedStepIndex !== index,
            ),
          );
        }
        break;
    }
  };

  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const handleNextStep = () => {
    const nextStepIndex = activeStepIndex + 1;
    if (nextStepIndex <= steps.length) {
      setActiveStepIndex(nextStepIndex);
    }
  };

  const handlePreviousStep = () => {
    const previousStepIndex = activeStepIndex - 1;
    if (previousStepIndex >= 0) {
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
        {activeStep.render(stepperContext)}
      </div>
    </div>
  );
};
