import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Toast } from 'components';
import { RootStore, UiStore } from 'stores';
import { Alert, AlertSeverity } from 'types';

export default {
  title: 'Components/Toast',
  component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => <Toast {...args} />;

const error = new Alert(
  {
    severity: AlertSeverity.Error,
    title: 'Error, something is wrong!',
    text: 'There seems to be a problem',
  },
  new UiStore(new RootStore()),
);

const warning = new Alert(
  {
    severity: AlertSeverity.Warning,
    title: 'Damn!',
    text: "Something went wrong, but we don't know what exactly",
  },
  new UiStore(new RootStore()),
);

const success = new Alert(
  {
    severity: AlertSeverity.Success,
    title: 'Success!',
    text: "Looks like everything is set up and ready to go! Let's roll!",
  },
  new UiStore(new RootStore()),
);

const info = new Alert(
  {
    severity: AlertSeverity.Info,
    title: 'Need help?',
    text: 'Just send us an email with your issue',
  },
  new UiStore(new RootStore()),
);

export const Error = Template.bind({});
Error.args = {
  alert: error,
};

export const Warning = Template.bind({});
Warning.args = {
  alert: warning,
};

export const Success = Template.bind({});
Success.args = {
  alert: success,
};

export const Info = Template.bind({});
Info.args = {
  alert: info,
};
