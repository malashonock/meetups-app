import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Form, Formik } from 'formik';
import classNames from 'classnames';

import {
  Button,
  SelectField,
  SelectOption,
  Typography,
  TypographyComponent,
} from 'components';
import { ShortUser } from 'model';
import { Nullable, Optional } from 'types';

export default {
  title: 'Components/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SelectField>;

interface FormValues {
  [name: string]: string | object | null;
}

const getFirstOption = <TValue extends unknown>(
  options?: SelectOption<TValue>[],
): Nullable<TValue> => {
  return options && options.length > 0 ? options[0].value : null;
};

const Template: ComponentStory<typeof SelectField> = (args) => (
  <Formik<FormValues>
    initialValues={{
      [args.name]: getFirstOption<FormValues[typeof args.name]>(
        args.selectProps?.options as Optional<
          SelectOption<FormValues[typeof args.name]>[]
        >,
      ),
    }}
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
        <SelectField {...args} />
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
          Field value: {JSON.stringify(values[args.name])}
        </Typography>
      </Form>
    )}
  </Formik>
);

const user1: ShortUser = {
  id: 'uuu-aaa',
  name: 'employee',
  surname: 'Gerlach',
};

const user2: ShortUser = {
  id: 'uuu-bbb',
  name: 'chief',
  surname: 'Blick',
};

const getUserName = (user: ShortUser): string => `${user.name} ${user.surname}`;

export const StringValue_SingleChoice = Template.bind({});
StringValue_SingleChoice.args = {
  name: 'author',
  labelText: 'Author',
  placeholderText: 'Select author...',
  selectProps: {
    options: [
      { value: getUserName(user1), label: getUserName(user1) },
      { value: getUserName(user2), label: getUserName(user2) },
    ],
  },
};

export const StringValue_MultiChoice = Template.bind({});
StringValue_MultiChoice.args = {
  ...StringValue_SingleChoice.args,
  placeholderText: 'Select authors...',
  selectProps: {
    ...StringValue_SingleChoice.args.selectProps,
    isMulti: true,
  },
};

export const ObjectValue_SingleChoice = Template.bind({});
ObjectValue_SingleChoice.args = {
  name: 'author',
  labelText: 'Author',
  placeholderText: 'Select author...',
  selectProps: {
    options: [
      { value: user1, label: getUserName(user1) },
      { value: user2, label: getUserName(user2) },
    ],
  },
};

export const ObjectValue_MultiChoice = Template.bind({});
ObjectValue_MultiChoice.args = {
  ...ObjectValue_SingleChoice.args,
  placeholderText: 'Select authors...',
  selectProps: {
    ...ObjectValue_SingleChoice.args.selectProps,
    isMulti: true,
  },
};
