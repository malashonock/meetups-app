import { observer } from 'mobx-react-lite';

import { Portal, Toast } from 'components';
import { useUiStore } from 'hooks';
import { Alert } from 'types';

import styles from './AlertStack.module.scss';

export const AlertStack = observer((): JSX.Element => {
  const { alerts } = useUiStore();

  return (
    <Portal wrapperId="toasts-root">
      <ul className={styles.toasts}>
        {alerts?.map((alert: Alert) => (
          <Toast
            key={JSON.stringify(alert)}
            variant={alert.severity}
            title={alert.title}
            description={alert.text}
            onClose={() => alert.dismiss()}
          />
        ))}
      </ul>
    </Portal>
  );
});
