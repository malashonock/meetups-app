import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';

import { StepConfig, Stepper, StepperContext } from 'components';
import { CreateMeetupOptionalFields } from './CreateMeetupOptionalFields/CreateMeetupOptionalFields';
import { CreateMeetupRequiredFields } from './CreateMeetupRequiredFields/CreateMeetupRequiredFields';
import { MeetupFields } from 'model';
import { createMeetup } from 'api';
import {
  meetupRequiredFieldsSchema,
  validateMeetupOptionalFields,
} from 'validation';

import styles from './CreateMeetupPage.module.scss';

const createMeetupSteps = (): StepConfig<FormikProps<MeetupFields>>[] => [
  {
    title: 'Обязательные поля',
    render: (
      context: StepperContext<FormikProps<MeetupFields>>,
    ): JSX.Element => <CreateMeetupRequiredFields {...context} />,
  },
  {
    title: 'Дополнительные поля',
    render: (
      context: StepperContext<FormikProps<MeetupFields>>,
    ): JSX.Element => <CreateMeetupOptionalFields {...context} />,
  },
];

export const CreateMeetupPage = (): JSX.Element => {
  const navigate = useNavigate();

  const [finished, setFinished] = useState(false);

  const initialValues: MeetupFields = {
    author: '',
    subject: '',
    excerpt: '',
    place: '',
    image: null,
  };

  const handleFinish = (): void => setFinished(true);

  const handleSubmit = async (newMeetupData: MeetupFields): Promise<void> => {
    if (finished) {
      await createMeetup(newMeetupData);
      navigate('/meetups');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={meetupRequiredFieldsSchema}
      validate={validateMeetupOptionalFields}
      onSubmit={handleSubmit}
    >
      {(formikProps: FormikProps<MeetupFields>) => (
        <Form className={styles.container}>
          <Stepper<FormikProps<MeetupFields>>
            steps={createMeetupSteps()}
            dataContext={formikProps}
            onFinish={handleFinish}
          />
        </Form>
      )}
    </Formik>
  );
};
