import { IconButton } from 'components/IconButton/IconButton';
import { ComponentPropsWithoutRef } from 'react';
import { ReactComponent as DeleteIcon } from './delete.svg';

export const DeleteButton = (
  props: Omit<ComponentPropsWithoutRef<typeof IconButton>, 'children'>,
): JSX.Element => {
  return (
    <IconButton {...props}>
      <DeleteIcon />
    </IconButton>
  );
};
