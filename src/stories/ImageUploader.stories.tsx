import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImageUploader } from 'components';

export default {
  title: 'Components/ImageUploader',
  component: ImageUploader,
} as ComponentMeta<typeof ImageUploader>;

const Template: ComponentStory<typeof ImageUploader> = () => <ImageUploader />;

export const Default = Template.bind({});
