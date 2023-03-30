import { useState } from 'react';
import { ComponentMeta } from '@storybook/react';

import { Modal } from 'components';

export default {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Modal>;

const Template = (): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <button onClick={openModal}>Open modal</button>
      <Modal show={showModal} onClose={closeModal}>
        <button onClick={closeModal}>Close modal</button>
      </Modal>
    </>
  );
};

export const Default = Template.bind({});
