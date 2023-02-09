import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';

import { StepConfig, Stepper, StepperContext } from 'components';
import { CreateMeetupOptionalFields } from './CreateMeetupOptionalFields/CreateMeetupOptionalFields';
import { CreateMeetupRequiredFields } from './CreateMeetupRequiredFields/CreateMeetupRequiredFields';
import { MeetupFields } from 'model';
import { useAuthStore, useMeetupStore } from 'hooks';
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

export const CreateMeetupPage = observer((): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const { meetupStore } = useMeetupStore();
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  const initialValues: MeetupFields = {
    author: loggedUser ? `${loggedUser.name} ${loggedUser.surname}` : '',
    subject: '',
    excerpt: '',
    place: '',
    image: null,
  };

  const handleFinish = (): void => setFinished(true);

  const handleSubmit = async (newMeetupData: MeetupFields): Promise<void> => {
    if (finished) {
      (async () => {
        await meetupStore?.createMeetup(newMeetupData);
        navigate('/meetups');
      })();
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
});
