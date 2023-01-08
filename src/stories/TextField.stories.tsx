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
    style: {},
    name: 'firstName',
    labelText: 'First name',
    placeholder: 'Enter first name',
  },
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
  <Formik
    validationSchema={object().shape({
      [args.name]: string().required(`${args.labelText} is required`),
    })}
    initialValues={{
      [args.name]: '',
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

export const ErrorTextOnly = Template.bind({});

export const WithSuccessText = Template.bind({});
WithSuccessText.args = {
  successText: 'Good job!',
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  helperText: 'First name will be used as your login',
};

export const WithSuccessAndHelperText = Template.bind({});
WithSuccessAndHelperText.args = {
  successText: 'Good job!',
  helperText: 'First name will be used as your login',
};
