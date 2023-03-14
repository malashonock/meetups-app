import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BurgerButton, ButtonVariant } from 'components';

export default {
  title: 'Components/BurgerButton',
  component: BurgerButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: { onClick: { action: 'clicked' } },
  args: {
    disabled: false,
  },
} as ComponentMeta<typeof BurgerButton>;

const Template: ComponentStory<typeof BurgerButton> = () => <BurgerButton />;

export const Default = Template.bind({});
