import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UserPreview } from 'components';

export default {
  title: 'Components/UserPreview',
  component: UserPreview,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof UserPreview>;

const Template: ComponentStory<typeof UserPreview> = (args) => (
  <div style={{ padding: '30px', background: '#8065ec' }}>
    <UserPreview {...args} />
  </div>
);

export const LoggedIn = Template.bind({});

LoggedIn.story = {
  argTypes: { name: { defaultValue: 'Nikolai Borisik' } },
};

export const LoggedOut = Template.bind({});

LoggedOut.story = {
  argTypes: { name: { control: { type: 'no' } } },
};
