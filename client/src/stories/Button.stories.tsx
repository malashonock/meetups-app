import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button, ButtonVariant } from 'components';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: { onClick: { action: 'clicked' } },
  args: {
    children: 'Button',
    disabled: false,
    style: {},
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  variant: ButtonVariant.Primary,
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: ButtonVariant.Secondary,
};

export const Default = Template.bind({});
Default.args = {
  variant: ButtonVariant.Default,
};
