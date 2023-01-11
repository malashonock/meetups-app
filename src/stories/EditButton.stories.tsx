import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EditButton } from 'components';

export default {
  title: 'Components/IconButton/EditButton',
  component: EditButton,
  argTypes: { onClick: { action: 'clicked' } },
  args: {
    disabled: false,
  },
} as ComponentMeta<typeof EditButton>;

const Template: ComponentStory<typeof EditButton> = (args) => (
  <EditButton {...args} />
);

export const Example = Template.bind({});
