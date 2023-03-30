import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Toast } from 'components';
import { AlertSeverity } from 'types';

export default {
  title: 'Components/Toast',
  component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => <Toast {...args} />;

export const Error = Template.bind({});
Error.args = {
  variant: AlertSeverity.Error,
  title: 'Error, something is wrong!',
  description: 'There seems to be a problem',
  onClose: () => {},
};

export const Warning = Template.bind({});
Warning.args = {
  variant: AlertSeverity.Warning,
  title: 'Damn!',
  description: "Something went wrong, but we don't know what exactly",
  onClose: () => {},
};

export const Success = Template.bind({});
Success.args = {
  variant: AlertSeverity.Success,
  title: 'Success!',
  description: "Looks like everything is set up and ready to go! Let's roll!",
  onClose: () => {},
};

export const Info = Template.bind({});
Info.args = {
  variant: AlertSeverity.Info,
  title: 'Need help?',
  description: 'Just send us an email with your issue',
  onClose: () => {},
};
