import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from 'components';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: { onClick: { action: 'clicked' } },
  args: {
    children: 'Button',
    disabled: false,
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
};
