import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImageDropbox } from 'components';

export default {
  title: 'Components/ImageUploader/ImageDropbox',
  component: ImageDropbox,
} as ComponentMeta<typeof ImageDropbox>;

const Template: ComponentStory<typeof ImageDropbox> = () => <ImageDropbox />;

export const Default = Template.bind({});
