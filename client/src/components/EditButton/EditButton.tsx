import { IconButton } from 'components';
import { ComponentPropsWithoutRef } from 'react';
import { ReactComponent as EditIcon } from './edit.svg';

export const EditButton = (
  props: Omit<ComponentPropsWithoutRef<typeof IconButton>, 'children'>,
): JSX.Element => (
  <IconButton {...props} data-testid="edit-button">
    <EditIcon />
  </IconButton>
);
