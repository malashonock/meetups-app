import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { object, string } from 'yup';
import { Formik, Form } from 'formik';

import { TextInput } from '../components/TextField/TextField';

export default {
  title: 'Components/TextField',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Title',
    description: 'It is a TextField description',
  },
} as ComponentMeta<typeof TextInput>;

const validationSchema = object().shape({
  userValue: string()
    .required('Please enter your value')
    .matches(
      /^(\S+$)/,
      'This field cannot contain spaces only or start with them',
    ),
});

const TextField: ComponentStory<typeof TextInput> = () => (
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
    {() => {
      return (
        <Form>
          <TextInput
            name="userValue"
            successText="Succes helper text"
            placeholder="Placeholder"
            labelText="Label"
          />
        </Form>
      );
    }}
  </Formik>
);

export const Default = TextField.bind({});
