import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImagePreviewMode, ImageUploader } from 'components';

export default {
  title: 'Components/ImageUploader',
  component: ImageUploader,
} as ComponentMeta<typeof ImageUploader>;

const Template: ComponentStory<typeof ImageUploader> = (args) => (
  <ImageUploader {...args} />
);

export const Thumbnail = Template.bind({});
Thumbnail.args = {
  variant: ImagePreviewMode.Thumbnail,
};

export const Large = Template.bind({});
Large.args = {
  variant: ImagePreviewMode.Large,
};
