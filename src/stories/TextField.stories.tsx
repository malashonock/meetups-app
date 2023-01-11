import React, { ComponentProps } from 'react';
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
          width: '500px',
          maxWidth: '100%',
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

type TextFieldProps = Partial<ComponentProps<typeof TextField>>;

const singleLineFieldArgs: TextFieldProps = {
  name: 'firstName',
  labelText: 'First name',
  placeholderText: 'Enter first name',
};

export const SingleLine_ErrorTextOnly = Template.bind({});
SingleLine_ErrorTextOnly.args = {
  ...singleLineFieldArgs,
};

export const SingleLine_WithSuccessText = Template.bind({});
SingleLine_WithSuccessText.args = {
  ...singleLineFieldArgs,
  successText: 'Input accepted',
};

export const SingleLine_WithHintText = Template.bind({});
SingleLine_WithHintText.args = {
  ...singleLineFieldArgs,
  hintText: 'First name will be used as your login',
};

export const SingleLine_WithSuccessAndHintText = Template.bind({});
SingleLine_WithSuccessAndHintText.args = {
  ...SingleLine_WithSuccessText.args,
  ...SingleLine_WithHintText.args,
};

const multiLineFieldArgs: TextFieldProps = {
  name: 'description',
  labelText: 'Description',
  placeholderText: 'Enter meetup description',
  multiline: true,
  maxLetterCount: 500,
};

export const MultiLine_ErrorTextOnly = Template.bind({});
MultiLine_ErrorTextOnly.args = {
  ...multiLineFieldArgs,
};

export const MultiLine_WithSuccessText = Template.bind({});
MultiLine_WithSuccessText.args = {
  ...multiLineFieldArgs,
  successText: 'Input accepted',
};

export const MultiLine_WithHintText = Template.bind({});
MultiLine_WithHintText.args = {
  ...multiLineFieldArgs,
  hintText: 'First name will be used as your login',
};

export const MultiLine_WithSuccessAndHintText = Template.bind({});
MultiLine_WithSuccessAndHintText.args = {
  ...MultiLine_WithSuccessText.args,
  ...MultiLine_WithHintText.args,
};