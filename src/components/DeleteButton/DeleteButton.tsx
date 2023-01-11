import { IconButton } from 'components';
import { ComponentPropsWithoutRef } from 'react';
import { ReactComponent as DeleteIcon } from './delete.svg';

export const DeleteButton = (
  props: Omit<ComponentPropsWithoutRef<typeof IconButton>, 'children'>,
): JSX.Element => (
  <IconButton {...props}>
    <DeleteIcon />
  </IconButton>
);
