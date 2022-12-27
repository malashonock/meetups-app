import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Typography, TypographySelector } from 'components';

const typographyUtilities: string[] = [
  'ff-1',
  'ff-2',
  'fw-regular',
  'fw-medium',
  'fw-bold',
  'fs-xs',
  'fs-s',
  'fs-m',
  'fs-l',
  'fs-xl',
  'lh-xs',
  'lh-s',
  'lh-m',
  'lh-l',
  'lh-xl',
  'lh-xxl',
  'ls-0',
  'ls-1',
  'fc-black',
  'fc-gray-01',
  'fc-gray-02',
  'fc-gray-03',
  'fc-white',
  'fc-purple',
  'ta-left',
  'ta-center',
  'ta-right',
];

export default {
  title: 'Components/Typography',
  component: Typography,
  argTypes: {
    className: {
      options: typographyUtilities,
      control: { type: 'check' },
    },
  },
  args: {
    children: 'Sample text',
    style: {},
  },
} as ComponentMeta<typeof Typography>;

const Template: ComponentStory<typeof Typography> = (args) => (
  <Typography {...args} />
);

export const HeadingTypography = Template.bind({});
HeadingTypography.args = {
  variant: TypographySelector.Heading,
};

export const ParagraphTypography = Template.bind({});
ParagraphTypography.args = {
  variant: TypographySelector.Paragraph,
};

export const OtherTypography = Template.bind({});
OtherTypography.args = {
  variant: TypographySelector.Other,
};
