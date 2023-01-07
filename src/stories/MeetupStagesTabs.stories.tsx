import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { MeetupStagesTabs } from 'components';

export default {
  title: 'Components/MeetupStagesTabs',
  component: MeetupStagesTabs,
  decorators: [withRouter],
  parameters: {
    layout: 'centered',
    reactRouter: {
      browserPath: '/meetups/topics',
    },
  },
} as ComponentMeta<typeof MeetupStagesTabs>;

const Template: ComponentStory<typeof MeetupStagesTabs> = () => (
  <div style={{ width: '550px' }}>
    <MeetupStagesTabs />
  </div>
);

export const Default = Template.bind({});
