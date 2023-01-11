import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tooltip, TooltipVariant } from 'components';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Title',
    description: 'It is a description inside a tooltip',
  },
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args}>
    <span>Hover to see a tooltip</span>
  </Tooltip>
);

export const Dark = Template.bind({});

Dark.args = {
  variant: TooltipVariant.Dark,
};

export const Colored = Template.bind({});

Colored.args = {
  variant: TooltipVariant.Colored,
};

export const Outline = Template.bind({});

Outline.args = {
  variant: TooltipVariant.Outline,
};

export const White = Template.bind({});

White.args = {
  variant: TooltipVariant.White,
};
