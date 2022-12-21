import { IconButton } from 'components/IconButton/IconButton';
import { ComponentPropsWithoutRef } from 'react';
import { ReactComponent as EditIcon } from './edit.svg';

export const EditButton = (
  props: Omit<ComponentPropsWithoutRef<typeof IconButton>, 'children'>,
): JSX.Element => {
  return (
    <IconButton {...props}>
      <EditIcon />
    </IconButton>
  );
};
