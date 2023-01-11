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
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof DateTimePicker>;

interface FormValues {
  [name: string]: Date | null;
}

const Template: ComponentStory<typeof DateTimePicker> = (args) => (
  <Formik<FormValues>
    initialValues={{
      [args.name]: null,
    }}
    validationSchema={yup.object().shape({
      [args.name]: yup.date().typeError('Select date and time'),
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
        <DateTimePicker {...args} />
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
          Field value: {values[args.name]?.toISOString()}
        </Typography>
      </Form>
    )}
  </Formik>
);

export const Default = Template.bind({});
Default.args = {
  name: 'startDate',
  labelText: 'Start date',
};

export const WithSuccessText = Template.bind({});
WithSuccessText.args = {
  ...Default.args,
  successText: 'Input accepted',
};

export const WithHintText = Template.bind({});
WithHintText.args = {
  ...Default.args,
  hintText: 'Enter start date',
};

export const WithSuccessAndHintText = Template.bind({});
WithSuccessAndHintText.args = {
  ...WithSuccessText.args,
  hintText: 'Enter start date',
};
