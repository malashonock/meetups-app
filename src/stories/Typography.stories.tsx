import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Typography } from 'components';

export default {
  title: 'Components/Typography',
  component: Typography,
  args: {
    children: 'Sample text',
    style: {},
  },
} as ComponentMeta<typeof Typography>;

const Template: ComponentStory<typeof Typography> = (args) => (
  <Typography {...args} />
);

export const BodyS = Template.bind({});
BodyS.args = {
  variant: 'body--s',
};

export const BodyXS = Template.bind({});
BodyXS.args = {
  variant: 'body--xs',
};

export const BtnTextDefault = Template.bind({});
BtnTextDefault.args = {
  variant: 'btn-text--default',
};

export const BtnTextPrimary = Template.bind({});
BtnTextPrimary.args = {
  variant: 'btn-text--primary',
};

export const BtnTextSecondary = Template.bind({});
BtnTextSecondary.args = {
  variant: 'btn-text--secondary',
};

export const H1F1 = Template.bind({});
H1F1.args = {
  variant: 'h1--f1',
};

export const H2F1 = Template.bind({});
H2F1.args = {
  variant: 'h2--f1',
};

export const H3F1 = Template.bind({});
H3F1.args = {
  variant: 'h3--f1',
};

export const H4F1 = Template.bind({});
H4F1.args = {
  variant: 'h4--f1',
};

export const H2F2 = Template.bind({});
H2F2.args = {
  variant: 'h2--f2',
};

export const H3F2 = Template.bind({});
H3F2.args = {
  variant: 'h3--f2',
};

export const Label = Template.bind({});
Label.args = {
  variant: 'label',
};

export const ParagraphC1 = Template.bind({});
ParagraphC1.args = {
  variant: 'paragraph--c1',
};

export const ParagraphC2 = Template.bind({});
ParagraphC2.args = {
  variant: 'paragraph--c2',
};

export const ParagraphC3 = Template.bind({});
ParagraphC3.args = {
  variant: 'paragraph--c3',
};

export const PlaceholderActive = Template.bind({});
PlaceholderActive.args = {
  variant: 'placeholder--active',
};

export const PlaceholderDefault = Template.bind({});
PlaceholderDefault.args = {
  variant: 'placeholder--default',
};

export const PlaceholderFocus = Template.bind({});
PlaceholderFocus.args = {
  variant: 'placeholder--focus',
};

export const Subtitle = Template.bind({});
Subtitle.args = {
  variant: 'subtitle',
};

const TemplateWithPurpleBg: ComponentStory<typeof Typography> = (args) => (
  <div style={{ padding: '30px', background: '#8065ec' }}>
    <Typography {...args} />
  </div>
);

export const Nav = TemplateWithPurpleBg.bind({});
Nav.args = {
  variant: 'nav',
};
