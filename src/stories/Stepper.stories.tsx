import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Stepper } from 'components';

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
    title: 'Обязательные поля',
    element: <p>Content 1</p>,
  },
  {
    title: 'Дополнительные поля',
    element: <p>Content 2</p>,
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
};
