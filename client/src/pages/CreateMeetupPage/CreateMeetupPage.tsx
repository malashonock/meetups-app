import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik, FormikErrors, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import { StepConfig, Stepper, StepperContext } from 'components';
import { CreateMeetupOptionalFields } from './CreateMeetupOptionalFields/CreateMeetupOptionalFields';
import { CreateMeetupRequiredFields } from './CreateMeetupRequiredFields/CreateMeetupRequiredFields';
import { MeetupStatus, NewMeetup } from 'model';
import { createMeetup } from 'api';
import { MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from 'helpers';

import styles from './CreateMeetupPage.module.scss';

const createMeetupSteps: StepConfig<FormikProps<NewMeetup>>[] = [
  {
    title: 'Обязательные поля',
    render: (context: StepperContext<FormikProps<NewMeetup>>): JSX.Element => (
      <CreateMeetupRequiredFields {...context} />
    ),
  },
  {
    title: 'Дополнительные поля',
    render: (context: StepperContext<FormikProps<NewMeetup>>): JSX.Element => (
      <CreateMeetupOptionalFields {...context} />
    ),
  },
];

const meetupRequiredFieldsSchema = yup.object().shape({
  author: yup.string().required('Необходимо указать спикера'),
  subject: yup.string().required('Необходимо заполнить тему митапа'),
  excerpt: yup.string().required('Необходимо заполнить описание митапа'),
});

const validateMeetupOptionalFields = ({
  start,
  finish,
}: NewMeetup): FormikErrors<NewMeetup> => {
  const errors: FormikErrors<NewMeetup> = {};

  if (start === null && finish !== null) {
    errors.start = 'Заполните дату начала митапа';
  }

  if (
    start !== null &&
    finish !== null &&
    finish <
      new Date(
        start.getTime() + 15 * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
      )
  ) {
    errors.finish = 'Дата окончания не может быть меньше даты начала';
  }

  return errors;
};

export const CreateMeetupPage = (): JSX.Element => {
  const navigate = useNavigate();

  const [finished, setFinished] = useState(false);

  const initialValues: NewMeetup = {
    author: '',
    modified: new Date(),
    start: null,
    finish: null,
    status: MeetupStatus.REQUEST,
    subject: '',
    excerpt: '',
    speakers: [],
    votedUsers: [],
    goCount: 0,
    place: '',
    image: null,
  };

  const handleFinish = (): void => setFinished(true);

  const handleSubmit = async (newMeetupData: NewMeetup): Promise<void> => {
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
      {(formikProps: FormikProps<NewMeetup>) => {
        return (
          <Form className={styles.container}>
            <Stepper<FormikProps<NewMeetup>>
              steps={createMeetupSteps}
              dataContext={formikProps}
              onFinish={handleFinish}
            />
          </Form>
        );
      }}
    </Formik>
  );
};
