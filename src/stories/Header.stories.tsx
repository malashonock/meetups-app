import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { Header } from 'components';

export default {
  title: 'Components/Header',
  component: Header,
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
    reactRouter: {
      browserPath: '/meetups',
    },
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = () => <Header />;

export const Default = Template.bind({});
Default.args = {};
