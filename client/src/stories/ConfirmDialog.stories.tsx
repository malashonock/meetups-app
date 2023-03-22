import { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ConfirmDialog } from 'components';

export default {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ConfirmDialog>;

const Template: ComponentStory<typeof ConfirmDialog> = (args): JSX.Element => {
  const [showDialog, setShowDialog] = useState(true);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  return (
    <>
      <button onClick={openDialog}>Open modal</button>
      <ConfirmDialog {...args} isOpen={showDialog} onClose={closeDialog} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  prompt: 'Are you sure you want to delete this meetup?',
  confirmBtnLabel: 'Yes, go delete it!',
  onConfirm: () => alert("Oops! It's gone now!"),
};
