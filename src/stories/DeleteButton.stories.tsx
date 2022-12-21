import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DeleteButton } from 'components';

export default {
  title: 'Components/IconButton/DeleteButton',
  component: DeleteButton,
  argTypes: { onClick: { action: 'clicked' } },
} as ComponentMeta<typeof DeleteButton>;

const Template: ComponentStory<typeof DeleteButton> = (args) => (
  <DeleteButton {...args} />
);

export const Example = Template.bind({});
