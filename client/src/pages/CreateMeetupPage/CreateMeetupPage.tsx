import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Form, Formik, FormikProps } from 'formik';
import { i18n } from 'i18next';
import { useTranslation } from 'react-i18next';

import { StepConfig, Stepper, StepperContext } from 'components';
import { CreateMeetupOptionalFields } from './CreateMeetupOptionalFields/CreateMeetupOptionalFields';
import { CreateMeetupRequiredFields } from './CreateMeetupRequiredFields/CreateMeetupRequiredFields';
import { MeetupFields } from 'model';
import { User } from 'stores';
import { useAuthStore, useMeetupStore } from 'hooks';
import {
  meetupRequiredFieldsSchema,
  validateMeetupOptionalFields,
} from 'validation';

import styles from './CreateMeetupPage.module.scss';

const createMeetupSteps = (): StepConfig<FormikProps<MeetupFields>>[] => [
  {
    title: ({ t }: i18n) => t('createMeetupPage.requiredFields.tabTitle'),
    render: (
      context: StepperContext<FormikProps<MeetupFields>>,
    ): JSX.Element => <CreateMeetupRequiredFields {...context} />,
  },
  {
    title: ({ t }: i18n) => t('createMeetupPage.optionalFields.tabTitle'),
    render: (
      context: StepperContext<FormikProps<MeetupFields>>,
    ): JSX.Element => <CreateMeetupOptionalFields {...context} />,
  },
];

export const CreateMeetupPage = observer((): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const meetupStore = useMeetupStore();
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const initialValues: MeetupFields = {
    author: loggedUser ? new User(loggedUser) : null,
    speakers: loggedUser ? [new User(loggedUser)] : [],
    subject: '',
    excerpt: '',
    place: '',
    image: null,
  };

  const handleFinish = (): void => setFinished(true);

  const handleSubmit = async (newMeetupData: MeetupFields): Promise<void> => {
    if (finished) {
      (async () => {
        const newMeetup = await meetupStore.createMeetup(newMeetupData);
        navigate(newMeetup ? `/meetups/${newMeetup.id}` : '/meetups');
      })();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={meetupRequiredFieldsSchema(i18n)}
      validate={validateMeetupOptionalFields(i18n)}
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
