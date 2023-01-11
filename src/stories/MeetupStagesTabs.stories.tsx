import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MeetupStagesTabs } from 'components';
import { withRouter } from 'storybook-addon-react-router-v6';

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
