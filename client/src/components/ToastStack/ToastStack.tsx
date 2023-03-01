import { observer } from 'mobx-react-lite';

import { Portal, Toast } from 'components';
import { useUiStore } from 'hooks';
import { Alert } from 'types';

import styles from './ToastStack.module.scss';

export const ToastStack = observer((): JSX.Element => {
  const { alerts } = useUiStore();

  return (
    <Portal wrapperId="toasts-portal">
      <ul className={styles.toasts}>
        {alerts?.map((alert: Alert) => (
          <Toast alert={alert} key={JSON.stringify(alert)} />
        ))}
      </ul>
    </Portal>
  );
});
