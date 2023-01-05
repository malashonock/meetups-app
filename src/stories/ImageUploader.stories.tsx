import { ComponentStory, ComponentMeta } from '@storybook/react';
import classNames from 'classnames';
import {
  Button,
  ImagePreviewMode,
  ImageUploader,
  Typography,
  TypographyComponent,
} from 'components';
import { Form, Formik } from 'formik';
import { FileWithUrl } from 'types';
import * as yup from 'yup';

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
    validationSchema={yup.object().shape({
      [name]: yup
        .mixed()
        .required(
          'Пожалуйста, загрузите изображение формата .jpg, .jpeg или .png',
        ),
    })}
    onSubmit={(values: FormValues, { setSubmitting }) => {
      console.log(values[name]);
      setSubmitting(false); // onSubmit is sync, so need to call this
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
        <Typography
          component={TypographyComponent.Paragraph}
          className={classNames(
            'font-family-1',
            'font-color-black',
            'font-size-xs',
            'line-height-xs',
          )}
        >
          Field value: {JSON.stringify(values[name])}
        </Typography>
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
