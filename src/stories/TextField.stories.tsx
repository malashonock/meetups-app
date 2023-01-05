import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { object, string } from 'yup';
import { Formik, Form } from 'formik';

import { TextField } from 'components';

export default {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'TextField',
  },
} as ComponentMeta<typeof TextField>;

const validationSchema = object().shape({
  userValue: string().required('Please enter your value'),
});

const TextFields: ComponentStory<typeof TextField> = (args) => (
  <Formik
    validationSchema={validationSchema}
    initialValues={{
      userValue: '',
    }}
    onSubmit={(values, { setSubmitting }) => {
      alert(JSON.stringify(values));
      setSubmitting(false);
    }}
  >
    {() => (
      <Form>
        <TextField {...args} />
      </Form>
    )}
  </Formik>
);

export const Default = TextFields.bind({});

Default.args = {
  name: 'userValue',
  placeholder: 'Placeholder',
  labelText: 'Label',
  successText: 'Success text',
};
