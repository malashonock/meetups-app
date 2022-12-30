import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Formik, Form } from 'formik';

import { Label } from '../components/TextField/InputLabel/InputLabel';
import { TextInput } from '../components/TextField/TextInput/TextInput';
import { validationSchema } from 'components/TextField/validations';

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
          <Label text="Label" />
          <TextInput
            name="userValue"
            successText="Succes helper text"
            placeholder="Placeholder"
          />
        </Form>
      );
    }}
  </Formik>
);

export const Default = TextField.bind({});
