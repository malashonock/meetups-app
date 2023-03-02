// Based on: https://akashhamirwasia.com/blog/building-expressive-confirm-dialog-api-in-react/

import { ConfirmDialog, ConfirmDialogProps } from 'components';
import {
  PropsWithChildren,
  useCallback,
  createContext,
  useRef,
  useState,
} from 'react';
import { Optional } from 'types';

export type ConfirmFn = (
  dialogDataProps: ConfirmDialogDataProps,
) => Promise<boolean>;
type ConfirmDialogDataProps = Pick<
  ConfirmDialogProps,
  'prompt' | 'confirmBtnLabel'
>;
type ConfirmResolver = (choice: boolean) => void;

export const ConfirmDialogContext = createContext<ConfirmFn>(() =>
  Promise.resolve(false),
);

export const ConfirmDialogProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [showDialog, setShowDialog] = useState(false);
  const [dataProps, setDataProps] =
    useState<Optional<ConfirmDialogDataProps>>();
  const confirmResolver = useRef<Optional<ConfirmResolver>>();

  const confirm = useCallback(
    (dialogDataProps: ConfirmDialogDataProps): Promise<boolean> => {
      return new Promise((resolve) => {
        setShowDialog(true);
        setDataProps({ ...dialogDataProps });

        confirmResolver.current = (choice: boolean) => {
          resolve(choice);
          setShowDialog(false);
        };
      });
    },
    [setShowDialog],
  );

  const handleConfirm = (): void => {
    if (confirmResolver.current) {
      confirmResolver.current(true);
    }
  };

  const handleClose = (): void => {
    if (confirmResolver.current) {
      confirmResolver.current(false);
    }
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {!!dataProps && (
        <ConfirmDialog
          {...dataProps}
          isOpen={showDialog}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
};
