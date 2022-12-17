import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tooltip } from 'components';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    heading: 'Heading',
    description: 'It is a description inside a tooltip',
  },
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <Tooltip {...args}>
      <button>Hover to see a tooltip</button>
    </Tooltip>
  </div>
);

export const Dark = Template.bind({});

Dark.args = {
  variant: 'dark',
};

export const Colored = Template.bind({});

Colored.args = {
  variant: 'colored',
};

export const Outline = Template.bind({});

Outline.args = {
  variant: 'outline',
};

export const White = Template.bind({});

White.args = {
  variant: 'white',
};
