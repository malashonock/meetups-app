import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Typography, TypographyComponent } from 'components';

const typographyUtilities: string[] = [
  'font-family-primary',
  'font-family-secondary',
  'font-weight-regular',
  'font-weight-medium',
  'font-weight-bold',
  'font-size-5xs',
  'font-size-4xs',
  'font-size-3xs',
  'font-size-2xs',
  'font-size-xs',
  'font-size-s',
  'font-size-m',
  'font-size-l',
  'font-size-xl',
  'line-height-0',
  'line-height-2xs',
  'line-height-xs',
  'line-height-s',
  'line-height-m',
  'line-height-l',
  'line-height-xl',
  'line-height-xxl',
  'letter-spacing-smaller',
  'letter-spacing-normal',
  'letter-spacing-larger-01',
  'letter-spacing-larger-02',
  'letter-spacing-larger-03',
  'font-color-dark',
  'font-color-gray-01',
  'font-color-gray-02',
  'font-color-gray-03',
  'font-color-white',
  'font-color-purple',
  'text-align-left',
  'text-align-center',
  'text-align-right',
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

export const Heading1Typography = Template.bind({});
Heading1Typography.args = {
  component: TypographyComponent.Heading1,
};

export const Heading2Typography = Template.bind({});
Heading2Typography.args = {
  component: TypographyComponent.Heading2,
};

export const Heading3Typography = Template.bind({});
Heading3Typography.args = {
  component: TypographyComponent.Heading3,
};

export const Heading4Typography = Template.bind({});
Heading4Typography.args = {
  component: TypographyComponent.Heading4,
};

export const Heading5Typography = Template.bind({});
Heading5Typography.args = {
  component: TypographyComponent.Heading5,
};

export const Heading6Typography = Template.bind({});
Heading6Typography.args = {
  component: TypographyComponent.Heading6,
};

export const ParagraphTypography = Template.bind({});
ParagraphTypography.args = {
  component: TypographyComponent.Paragraph,
};

export const SpanTypography = Template.bind({});
SpanTypography.args = {
  component: TypographyComponent.Span,
};
