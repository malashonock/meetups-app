import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BurgerButton } from 'components';
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

  const toggleBurgerMenu = (): void => {
    setIsOpen(!isOpen);
  };

  return <BurgerButton isOpen={isOpen} onToggleOpen={toggleBurgerMenu} />;
};

export const Default = Template.bind({});
