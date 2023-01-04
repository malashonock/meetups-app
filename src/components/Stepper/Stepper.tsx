import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { StepperProgress, StepContent, Step } from 'components';

import styles from './Stepper.module.scss';

export enum StepVariant {
  Active = 'active',
  Available = 'available',
  Confirmed = 'confirmed',
  Disabled = 'disabled',
}

interface StepDescriptor {
  title: string;
  element: JSX.Element;
  variant: StepVariant;
  confirmed: boolean;
}

export type StepperContextType = {
  stepsDescriptor: StepDescriptor[];
  setStepsDescriptor: Dispatch<SetStateAction<StepDescriptor[]>>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleCreate: () => void;
};

export const StepperContext = React.createContext<StepperContextType | null>(
  null,
);

interface Step {
  title: string;
  element: JSX.Element;
}

interface StepperProps {
  steps: Step[];
}

export const Stepper = ({ steps }: StepperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [stepsDescriptor, setStepsDescriptor] = useState(
    steps.map((step) =>
      Object.assign({}, step, {
        variant: StepVariant.Disabled,
        confirmed: false,
      }),
    ),
  );

  useEffect(() => {
    stepsDescriptor.map((step, i) => {
      if (i === 0) {
        step.variant = StepVariant.Active;
        return step;
      }
      return step;
    });
  }, []);

  useEffect(() => {
    moveStepper();

    setStepsDescriptor(
      stepsDescriptor.map((step, i) => {
        if (i === currentStep) {
          step.variant = StepVariant.Active;
          return step;
        }
        return step;
      }),
    );
  }, [currentStep]);

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= steps.length) {
      setStepsDescriptor(
        stepsDescriptor.map((step, i) => {
          if (i === currentStep) {
            if (step.confirmed) step.variant = StepVariant.Confirmed;
            else step.variant = StepVariant.Available;
            return step;
          }
          return step;
        }),
      );
      setCurrentStep(nextStep);
    }
  };

  const handlePreviousStep = () => {
    const previousStep = currentStep - 1;
    if (previousStep >= 0) {
      setStepsDescriptor(
        stepsDescriptor.map((step, i) => {
          if (i === currentStep) {
            if (step.confirmed) step.variant = StepVariant.Confirmed;
            else step.variant = StepVariant.Available;
            return step;
          }
          return step;
        }),
      );
      setCurrentStep(previousStep);
    }
  };

  const handleCreate = () => {};

  const moveStepper = () => {
    document.documentElement.style.setProperty(
      '--currentStep',
      `-${currentStep}`,
    );
  };

  return (
    <StepperContext.Provider
      value={{
        stepsDescriptor,
        setStepsDescriptor,
        handleNextStep,
        handlePreviousStep,
        handleCreate,
      }}
    >
      <div className={styles.stepper}>
        <StepperProgress currentStep={currentStep} />
        <div
          className={styles['stepper-body']}
          style={
            {
              '--numOfSteps': steps.length,
            } as React.CSSProperties
          }
        >
          {steps.map((step, i) => (
            <StepContent
              key={step.title}
              currentStep={currentStep}
              isFirst={i === 0}
              isLast={i === steps.length - 1}
            >
              {step.element}
            </StepContent>
          ))}
        </div>
      </div>
    </StepperContext.Provider>
  );
};
