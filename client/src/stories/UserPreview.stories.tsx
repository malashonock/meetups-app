import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserPreview, UserPreviewVariant } from 'components';

export default {
  title: 'Components/UserPreview',
  component: UserPreview,
} as ComponentMeta<typeof UserPreview>;

/* Mock users */
const user_EN_FirstName = {
  id: 'AAA-AAA',
  name: 'John',
  surname: '',
};

const user_EN_FullName = {
  id: 'AAA-AAA',
  name: 'John',
  surname: 'Doe',
};

const user_EN_ManyNames = {
  id: 'AAA-AAA',
  name: 'John F.',
  surname: 'Kennedy',
};

const user_RU_FirstName = {
  id: 'AAA-AAA',
  name: 'Вася',
  surname: '',
};

const user_RU_FullName = {
  id: 'AAA-AAA',
  name: 'Вася',
  surname: 'Пупкин',
};

const user_RU_ManyNames = {
  id: 'AAA-AAA',
  name: 'Остап Сулейман Ибрагим',
  surname: 'Берта-Мария Бендер-бей',
};

const DefaultTemplate: ComponentStory<typeof UserPreview> = (args) => (
  <UserPreview {...args} />
);

/* Default variant */

export const Default_EN_FirstName = DefaultTemplate.bind({});

Default_EN_FirstName.args = {
  variant: UserPreviewVariant.Default,
  user: user_EN_FirstName,
};

export const Default_RU_FullName = DefaultTemplate.bind({});

Default_RU_FullName.args = {
  variant: UserPreviewVariant.Default,
  user: user_RU_FullName,
};

/* Card variant */

export const Card_EN_FirstName = DefaultTemplate.bind({});

Card_EN_FirstName.args = {
  variant: UserPreviewVariant.Card,
  user: user_EN_FirstName,
};

export const Card_EN_FullName = DefaultTemplate.bind({});

Card_EN_FullName.args = {
  variant: UserPreviewVariant.Card,
  user: user_EN_FullName,
};

export const Card_EN_ManyNames = DefaultTemplate.bind({});

Card_EN_ManyNames.args = {
  variant: UserPreviewVariant.Card,
  user: user_EN_ManyNames,
};

export const Card_RU_FirstName = DefaultTemplate.bind({});

Card_RU_FirstName.args = {
  variant: UserPreviewVariant.Card,
  user: user_RU_FirstName,
};

export const Card_RU_FullName = DefaultTemplate.bind({});

Card_RU_FullName.args = {
  variant: UserPreviewVariant.Card,
  user: user_RU_FullName,
};

export const Card_RU_ManyNames = DefaultTemplate.bind({});

Card_RU_ManyNames.args = {
  variant: UserPreviewVariant.Card,
  user: user_RU_ManyNames,
};

/* Image variant */

export const Image_EN_FirstName = DefaultTemplate.bind({});

Image_EN_FirstName.args = {
  variant: UserPreviewVariant.Image,
  user: user_EN_FirstName,
};

export const Image_RU_FullName = DefaultTemplate.bind({});

Image_RU_FullName.args = {
  variant: UserPreviewVariant.Image,
  user: user_RU_FullName,
};

/* Header template and variant */

const HeaderTemplate: ComponentStory<typeof UserPreview> = (args) => (
  <div style={{ background: '#8065ec', padding: '10px' }}>
    <UserPreview {...args} />
  </div>
);

export const Header_EN_FirstName = HeaderTemplate.bind({});

Header_EN_FirstName.args = {
  variant: UserPreviewVariant.Header,
  user: user_EN_FirstName,
};

export const Header_EN_FullName = HeaderTemplate.bind({});

Header_EN_FullName.args = {
  variant: UserPreviewVariant.Header,
  user: user_EN_FullName,
};

export const Header_EN_ManyNames = HeaderTemplate.bind({});

Header_EN_ManyNames.args = {
  variant: UserPreviewVariant.Header,
  user: user_EN_ManyNames,
};

export const Header_RU_FirstName = HeaderTemplate.bind({});

Header_RU_FirstName.args = {
  variant: UserPreviewVariant.Header,
  user: user_RU_FirstName,
};

export const Header_RU_FullName = HeaderTemplate.bind({});

Header_RU_FullName.args = {
  variant: UserPreviewVariant.Header,
  user: user_RU_FullName,
};

export const Header_RU_ManyNames = HeaderTemplate.bind({});

Header_RU_ManyNames.args = {
  variant: UserPreviewVariant.Header,
  user: user_RU_ManyNames,
};
