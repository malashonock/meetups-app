import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TabsManager } from 'components';

export default {
  title: 'Components/Tabs',
  component: TabsManager,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof TabsManager>;

const tabs = [
  {
    title: 'Tab 1',
    element: <p>Tab 1 Content</p>,
  },
  {
    title: 'Tab 2',
    element: <p>Tab 2 Content</p>,
  },
  {
    title: 'Tab 3',
    element: <p>Tab 3 Content</p>,
  },
];

const Template: ComponentStory<typeof TabsManager> = (args) => (
  <div style={{ width: '550px' }}>
    <TabsManager {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  tabs,
};
