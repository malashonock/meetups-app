import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button, ImagePreviewMode, ImageUploader } from 'components';
import { Form, Formik } from 'formik';
import { FileWithUrl } from 'types';

export default {
  title: 'Components/ImageUploader',
  component: ImageUploader,
} as ComponentMeta<typeof ImageUploader>;

interface FormValues {
  [name: string]: FileWithUrl | null;
}

const Template: ComponentStory<typeof ImageUploader> = ({ name, variant }) => (
  <Formik<FormValues>
    initialValues={{
      [name]: null,
    }}
    onSubmit={(values) => {
      console.log(values[name]);
    }}
  >
    {({ values }) => (
      <Form
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: '12px',
        }}
      >
        <ImageUploader name={name} variant={variant} />
        <Button type="submit">Submit (check console logs)</Button>
        <div>{JSON.stringify(values[name])}</div>
      </Form>
    )}
  </Formik>
);

export const Thumbnail = Template.bind({});
Thumbnail.args = {
  name: 'meetupPhoto',
  variant: ImagePreviewMode.Thumbnail,
};

export const Large = Template.bind({});
Large.args = {
  name: 'newsPhoto',
  variant: ImagePreviewMode.Large,
};
