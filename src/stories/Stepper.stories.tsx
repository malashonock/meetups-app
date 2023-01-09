import { ComponentStory, ComponentMeta } from '@storybook/react';

import { StepElementProps, Stepper } from 'components';

/* Mocked steps */
const steps = [
  {
    title: 'Step 1',
    element: ({ setConfirmed, index }: StepElementProps) => (
      <div>
        <p>Some content of step 1</p>
        <button onClick={() => setConfirmed(index, true)}>Click to pass</button>
        <button onClick={() => setConfirmed(index, false)}>
          Click to fail
        </button>
      </div>
    ),
  },
  {
    title: 'Step 2',
    element: () => <p>This is a step without validation</p>,
    noVerify: true,
  },
  {
    title: 'Step 3',
    element: ({ setConfirmed, index }: StepElementProps) => (
      <div>
        <p>Some content of step 3</p>
        <button onClick={() => setConfirmed(index, true)}>Click to pass</button>
        <button onClick={() => setConfirmed(index, false)}>
          Click to fail
        </button>
      </div>
    ),
  },
];

export default {
  title: 'Components/Stepper',
  component: Stepper,
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

export const WithCustomButton = Template.bind({});

WithCustomButton.args = {
  finishButtonContent: 'Подтвердить',
};

export const WithCustomComplexButton = Template.bind({});

WithCustomComplexButton.args = {
  finishButtonContent: (
    <div style={{ display: 'flex', columnGap: '10px' }}>
      <span>+</span>
      <span>Добавить</span>
    </div>
  ),
};
