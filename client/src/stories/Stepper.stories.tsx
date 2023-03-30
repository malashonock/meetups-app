import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button, ButtonVariant, Stepper, StepperContext } from 'components';
import { withRouter } from 'storybook-addon-react-router-v6';

/* Mocked steps */
const steps = [
  {
    title: () => 'Step 1',
    render: ({
      stepsState,
      setStepPassed,
      activeStep,
      handleBack,
      handleNextStep,
    }: StepperContext<{}>): JSX.Element => (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: '12px',
        }}
      >
        <p>Some content of step 1</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={() => {
              setStepPassed(activeStep.index, false);
            }}
            disabled={!activeStep.passed}
          >
            Click to fail
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            onClick={() => {
              setStepPassed(activeStep.index, true);
            }}
            disabled={activeStep.passed}
          >
            Click to pass
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={() => {
              handleBack();
            }}
          >
            Go back
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            onClick={() => {
              handleNextStep();
            }}
            disabled={!activeStep.passed}
          >
            Go to next step
          </Button>
        </div>
      </div>
    ),
  },
  {
    title: () => 'Step 2',
    render: ({
      handlePreviousStep,
      handleNextStep,
    }: StepperContext<{}>): JSX.Element => (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: '12px',
        }}
      >
        <p>This is a step without validation</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={() => {
              handlePreviousStep();
            }}
          >
            Go to previous step
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            onClick={() => {
              handleNextStep();
            }}
          >
            Go to next step
          </Button>
        </div>
      </div>
    ),
    noValidate: true,
  },
  {
    title: () => 'Step 3',
    render: ({
      stepsState,
      setStepPassed,
      activeStep,
      handlePreviousStep,
      handleFinish,
    }: StepperContext<{}>): JSX.Element => (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: '12px',
        }}
      >
        <p>Some content of step 3</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={() => {
              setStepPassed(activeStep.index, false);
            }}
            disabled={!activeStep.passed}
          >
            Click to fail
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            onClick={() => {
              setStepPassed(activeStep.index, true);
            }}
            disabled={activeStep.passed}
          >
            Click to pass
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={() => {
              handlePreviousStep();
            }}
          >
            Go to previous step
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            onClick={() => {
              handleFinish();
            }}
            disabled={!activeStep.passed}
          >
            Go to finish
          </Button>
        </div>
      </div>
    ),
  },
];

export default {
  title: 'Components/Stepper',
  component: Stepper,
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
  },
  args: {
    steps: steps,
    onFinish: () => alert('Something is done!'),
  },
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => (
  <div style={{ width: '550px' }}>
    <Stepper {...args} />
  </div>
);

export const Default = Template.bind({});
