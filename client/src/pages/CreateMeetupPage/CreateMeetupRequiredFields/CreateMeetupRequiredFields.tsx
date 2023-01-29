import classNames from 'classnames';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  SelectField,
  SelectOption,
  StepperContext,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NewMeetupState } from 'pages';
import { MeetupRequiredFields, meetupRequiredFieldsSchema } from 'validation';
import { useTouchOnLocaleChanged, useUiStore, useUserStore } from 'hooks';
import { User } from 'stores';
import { Nullable } from 'types';

import styles from './CreateMeetupRequiredFields.module.scss';

interface CreateMeetupRequiredFieldsProps {
  context: StepperContext<NewMeetupState>;
  formikProps: FormikProps<MeetupRequiredFields>;
}

const CreateMeetupRequiredFieldsForm = ({
  context,
  formikProps,
}: CreateMeetupRequiredFieldsProps): JSX.Element => {
  const { activeStep, setStepPassed, handleBack } = context;

  const { touched, errors, isSubmitting, setFieldTouched } = formikProps;

  const { users } = useUserStore();
  const { t } = useTranslation();
  const { locale } = useUiStore();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

  const isTouched = Object.entries(touched).length > 0;
  const hasErrors = Object.entries(errors).length > 0;
  const isPassed = (isTouched || activeStep.passed) && !hasErrors;
  const canSubmit = isPassed && !hasErrors && !isSubmitting;

  // sync stepper state
  if (isPassed !== activeStep.passed) {
    // mute console error
    setTimeout(() => setStepPassed(activeStep.index, isPassed), 0);
  }

  return (
    <Form className={styles.container}>
      <div className={styles.heading}>
        <Typography
          className={styles.title}
          component={TypographyComponent.Heading1}
        >
          {t('createMeetupPage.title')}
        </Typography>
        <Typography
          className={styles.subTitle}
          component={TypographyComponent.Paragraph}
        >
          {t('createMeetupPage.subTitle')}
        </Typography>
      </div>
      <div className={styles.contentWrapper}>
        <div className={classNames(styles.textSection, styles.main)}>
          <TextField
            name="subject"
            labelText={t('formFields.meetup.topic.label') || 'Topic'}
          />
          <SelectField<User>
            name="author"
            labelText={t('formFields.meetup.speaker.label') || 'Speaker'}
            placeholderText={
              t('formFields.meetup.speaker.placeholder') || 'Select speaker...'
            }
            selectProps={{
              options: users?.map(
                (user: User): SelectOption<User> => ({
                  value: user,
                  label: user.fullName,
                }),
              ),
            }}
            comparerFn={(u1: Nullable<User>, u2: Nullable<User>) =>
              u1?.id === u2?.id
            }
          />
          <TextField
            name="excerpt"
            labelText={
              t('formFields.meetup.description.label') || 'Description'
            }
            multiline
          />
        </div>
        <div className={classNames(styles.textSection, styles.actions)}>
          <Button
            type="button"
            onClick={handleBack}
            variant={ButtonVariant.Default}
            className={classNames(styles.actionButton, styles.back)}
          >
            {t('formButtons.back')}
          </Button>
          <Button
            type="submit"
            variant={ButtonVariant.Primary}
            className={classNames(styles.actionButton, styles.next)}
            disabled={!canSubmit}
          >
            {t('formButtons.next')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export const CreateMeetupRequiredFields = (
  context: StepperContext<NewMeetupState>,
): JSX.Element => {
  const { i18n } = useTranslation();

  const {
    dataContext: [newMeetupData, setNewMeetupData],
    handleNextStep,
  } = context;

  const { author, subject, excerpt } = newMeetupData;

  const initialValues: MeetupRequiredFields = {
    author,
    subject,
    excerpt,
  };

  const handleSubmit = (
    values: MeetupRequiredFields,
    { setSubmitting }: FormikHelpers<MeetupRequiredFields>,
  ): void => {
    setNewMeetupData({
      ...newMeetupData,
      ...values,
    });
    setSubmitting(false);
    handleNextStep();
  };

  return (
    <Formik<MeetupRequiredFields>
      initialValues={initialValues}
      validationSchema={meetupRequiredFieldsSchema(i18n)}
      onSubmit={handleSubmit}
    >
      {(formikProps: FormikProps<MeetupRequiredFields>) => (
        <CreateMeetupRequiredFieldsForm
          context={context}
          formikProps={formikProps}
        />
      )}
    </Formik>
  );
};
