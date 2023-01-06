import { ComponentStory, ComponentMeta } from '@storybook/react';
import classNames from 'classnames';
import {
  Button,
  DateTimePicker,
  Typography,
  TypographyComponent,
} from 'components';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

export default {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
} as ComponentMeta<typeof DateTimePicker>;

interface FormValues {
  [name: string]: Date | null;
}

const Template: ComponentStory<typeof DateTimePicker> = ({
  name,
  placeholderText,
}) => (
  <Formik<FormValues>
    initialValues={{
      [name]: null,
    }}
    validationSchema={yup.object().shape({
      [name]: yup.date().required('Выберите дату и время'),
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
        <DateTimePicker name={name} placeholderText={placeholderText} />
        <Button type="submit">Submit (check console logs)</Button>
        <Typography
          component={TypographyComponent.Paragraph}
          className={classNames(
            'font-family-primary',
            'font-color-dark',
            'font-size-xs',
            'line-height-xs',
          )}
        >
          Field value: {values[name]?.toISOString()}
        </Typography>
      </Form>
    )}
  </Formik>
);

export const Thumbnail = Template.bind({});
Thumbnail.args = {
  name: 'meetupDate',
};

export const Default = Template.bind({});
