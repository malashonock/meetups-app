import { ComponentStory, ComponentMeta } from '@storybook/react';

import { RootStoreProvider, AlertStack } from 'components';
import { useUiStore } from 'hooks';
import { PropsWithChildren, useEffect } from 'react';
import { UiStore, RootStore } from 'stores';
import { Alert, AlertSeverity } from 'types';

export default {
  title: 'Components/AlertStack',
  component: AlertStack,
} as ComponentMeta<typeof AlertStack>;

const SeedAlerts = ({ children }: PropsWithChildren): JSX.Element => {
  const { uiStore } = useUiStore();

  useEffect(() => {
    if (uiStore) {
      const error = new Alert(
        {
          severity: AlertSeverity.Error,
          title: 'Error, something is wrong!',
          text: 'There seems to be a problem',
          expiresIn: 4_000,
        },
        uiStore,
      );

      const warning = new Alert(
        {
          severity: AlertSeverity.Warning,
          title: 'Damn!',
          text: "Something went wrong, but we don't know what exactly",
          expiresIn: 6_000,
        },
        uiStore,
      );

      const success = new Alert(
        {
          severity: AlertSeverity.Success,
          title: 'Success!',
          text: "Looks like everything is set up and ready to go! Let's roll!",
          expiresIn: 8_000,
        },
        uiStore,
      );

      const info = new Alert(
        {
          severity: AlertSeverity.Info,
          title: 'Need help?',
          text: 'Just send us an email with your issue',
          expiresIn: 10_000,
        },
        uiStore,
      );

      uiStore.alerts = [error, warning, success, info];
    }
  }, [uiStore]);

  return <>{children}</>;
};

const Template: ComponentStory<typeof AlertStack> = () => (
  <RootStoreProvider>
    <SeedAlerts>
      <AlertStack />
    </SeedAlerts>
  </RootStoreProvider>
);

export const Default = Template.bind({});
