import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DateTimePicker } from 'components';

export default {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
} as ComponentMeta<typeof DateTimePicker>;

const Template: ComponentStory<typeof DateTimePicker> = () => (
  <DateTimePicker />
);

export const Default = Template.bind({});
