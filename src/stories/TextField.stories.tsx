import React from 'react';
import classNames from 'classnames';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';

import { Button, TextField, Typography, TypographyComponent } from 'components';

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
    placeholderText: 'Enter first name',
  },
} as ComponentMeta<typeof TextField>;

interface FormValues {
  [name: string]: String;
}

const Template: ComponentStory<typeof TextField> = (args) => (
  <Formik<FormValues>
    initialValues={{
      [args.name]: '',
    }}
    validationSchema={yup.object().shape({
      [args.name]: yup.string().required(`${args.labelText} is required`),
    })}
    onSubmit={(values: FormValues, { setSubmitting }) => {
      console.log(values[args.name]);
      setSubmitting(false); // onSubmit is sync, so need to call this
    }}
  >
    {({ values }) => (
      <Form
        autoComplete="off"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: '12px',
        }}
      >
        <TextField {...args} />
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
          Field value: {values[args.name]}
        </Typography>
      </Form>
    )}
  </Formik>
);

export const ErrorTextOnly = Template.bind({});

export const WithSuccessText = Template.bind({});
WithSuccessText.args = {
  successText: 'Input accepted',
};

export const WithHintText = Template.bind({});
WithHintText.args = {
  hintText: 'First name will be used as your login',
};

export const WithSuccessAndHintText = Template.bind({});
WithSuccessAndHintText.args = {
  ...WithSuccessText.args,
  ...WithHintText.args,
};
