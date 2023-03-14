import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BurgerButton, ButtonVariant } from 'components';
import { useState } from 'react';

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

const Template: ComponentStory<typeof BurgerButton> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export const Default = Template.bind({});
