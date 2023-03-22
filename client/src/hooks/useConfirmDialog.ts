import { useContext } from 'react';

import { ConfirmDialogContext, ConfirmFn } from 'components';

export const useConfirmDialog = (): ConfirmFn => {
  return useContext(ConfirmDialogContext);
};
