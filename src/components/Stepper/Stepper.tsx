import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { StepperProgress, StepContent, Step } from 'components';

import styles from './Stepper.module.scss';

export enum StepVariant {
  Active = 'active',
  Available = 'available',
  Confirmed = 'confirmed',
  Disabled = 'disabled',
}

export interface StepElementProps {
  setConfirmed: (index: number, state: boolean) => void;
  index: number;
}

interface Step {
  title: string;
  element: ({ setConfirmed, index }: StepElementProps) => JSX.Element;
  noVerify?: boolean;
}

export interface StepDescriptor extends Step {
  variant: StepVariant;
  confirmed: boolean;
  visited: boolean;
}

export const StepperContext = createContext<StepperContextType | null>(null);

export type StepperContextType = {
  stepsDescriptor: StepDescriptor[];
  setStepsDescriptor: Dispatch<SetStateAction<StepDescriptor[]>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleFinish: () => void;
};

interface StepperProps {
  steps: Step[];
  onFinish: () => void;
}

export const Stepper = ({ steps, onFinish }: StepperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [stepsDescriptor, setStepsDescriptor] = useState(
    steps.map((step) =>
      Object.assign({}, step, {
        variant: StepVariant.Disabled,
        confirmed: false,
        visited: false,
      }),
    ),
  );

  const moveStepperContent = () => {
    document.documentElement.style.setProperty(
      '--currentStep',
      `-${currentStep}`,
    );
  };

  const changeCurrentStepVariantBeforeLeave = (
    step: StepDescriptor,
    index: number,
  ): StepDescriptor => {
    if (index === currentStep) {
      return {
        ...step,
        variant: step.confirmed ? StepVariant.Confirmed : StepVariant.Available,
      };
    }

    return step;
  };

  const setConfirmed = (index: number, state: boolean) => {
    setStepsDescriptor(
      stepsDescriptor.map((step, i) => {
        if (i === index) {
          step.confirmed = state;

          /* Set appropriate variant to next steps (if they exist) if current step is confirmed */
          if (stepsDescriptor[i + 1] && state)
            for (
              let nextStepIndex = i + 1;
              nextStepIndex < stepsDescriptor.length;
              nextStepIndex++
            )
              stepsDescriptor[nextStepIndex].variant = stepsDescriptor[
                nextStepIndex
              ].confirmed
                ? StepVariant.Confirmed
                : stepsDescriptor[nextStepIndex].visited ||
                  nextStepIndex === i + 1
                ? StepVariant.Available
                : StepVariant.Disabled;

          /* Set disabled variant to next steps (if they exist) if current step is not confirmed */
          if (stepsDescriptor[i + 1] && !state)
            for (
              let nextStepIndex = i + 1;
              nextStepIndex < stepsDescriptor.length;
              nextStepIndex++
            )
              stepsDescriptor[nextStepIndex].variant = StepVariant.Disabled;

          return step;
        }

        return step;
      }),
    );
  };

  useEffect(() => {
    if (stepsDescriptor[currentStep].noVerify) {
      setConfirmed(currentStep, true);
    }

    setStepsDescriptor(
      stepsDescriptor.map((step, i) =>
        i === currentStep
          ? { ...step, variant: StepVariant.Active, visited: true }
          : step,
      ),
    );

    moveStepperContent();
  }, [currentStep]);

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= steps.length) {
      setStepsDescriptor(
        stepsDescriptor.map(changeCurrentStepVariantBeforeLeave),
      );

      setCurrentStep(nextStep);
    }
  };

  const handlePreviousStep = () => {
    const previousStep = currentStep - 1;
    if (previousStep >= 0) {
      setStepsDescriptor(
        stepsDescriptor.map(changeCurrentStepVariantBeforeLeave),
      );

      setCurrentStep(previousStep);
    }
  };

  const handleFinish = onFinish;

  return (
    <StepperContext.Provider
      value={{
        stepsDescriptor,
        setStepsDescriptor,
        handleNextStep,
        handlePreviousStep,
        handleFinish,
      }}
    >
      <div className={styles.stepper}>
        <StepperProgress currentStep={currentStep} />
        <div
          className={styles.stepperBody}
          style={
            {
              '--numOfSteps': steps.length,
            } as React.CSSProperties
          }
        >
          {steps.map(
            (step: Step, index: number): JSX.Element => (
              <StepContent
                key={step.title}
                step={index}
                currentStep={currentStep}
                isFirst={index === 0}
                isLast={index === steps.length - 1}
              >
                {step.element({ setConfirmed, index })}
              </StepContent>
            ),
          )}
        </div>
      </div>
    </StepperContext.Provider>
  );
};
