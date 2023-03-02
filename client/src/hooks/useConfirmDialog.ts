import { useContext } from 'react';

import { ConfirmDialogContext, ConfirmFn } from 'components';
import { Optional } from 'types';

export const useConfirmDialog = (): ConfirmFn => {
  return useContext(ConfirmDialogContext);
};
