import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { ViewMeetupPage } from 'pages';

export default {
  title: 'Pages/ViewMeetupPage',
  component: ViewMeetupPage,
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
    reactRouter: {
      routePath: '/meetups/:id',
    },
  },
} as ComponentMeta<typeof ViewMeetupPage>;

const Template: ComponentStory<typeof ViewMeetupPage> = () => (
  <div style={{ width: '550px' }}>
    <ViewMeetupPage />
  </div>
);

export const DraftMeetupView = Template.bind({});

DraftMeetupView.parameters = {
  reactRouter: {
    routeParams: {
      id: '0959abb9-68ee-4ca3-960f-56e939e21099',
    },
  },
};

export const ConfirmedMeetupView = Template.bind({});

ConfirmedMeetupView.parameters = {
  reactRouter: {
    routeParams: { id: '91459d58-a8c4-469c-b9a3-a0a209601b02' },
  },
};
