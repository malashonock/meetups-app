import { ComponentStory, ComponentMeta } from '@storybook/react';

import { StepElementProps, Stepper } from 'components';

export default {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Stepper>;

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

const Template: ComponentStory<typeof Stepper> = (args) => (
  <div style={{ width: '550px' }}>
    <Stepper {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  steps: steps,
  onFinish: () => alert('Something is done!'),
};
