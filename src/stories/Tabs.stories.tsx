import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { Tabs } from 'components';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
    reactRouter: {
      browserPath: '/meetups/topics',
    },
  },
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = () => (
  <div style={{ width: '550px' }}>
    <Tabs />
  </div>
);

export const Default = Template.bind({});
