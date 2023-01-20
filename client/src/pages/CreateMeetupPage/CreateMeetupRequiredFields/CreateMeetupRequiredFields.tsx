import classNames from 'classnames';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';

import {
  Button,
  ButtonVariant,
  StepperContext,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NewMeetupState } from 'pages';
import { MeetupRequiredFields, meetupRequiredFieldsSchema } from 'validation';

import styles from './CreateMeetupRequiredFields.module.scss';

export const CreateMeetupRequiredFields = ({
  dataContext: [newMeetupData, setNewMeetupData],
  activeStep,
  setStepPassed,
  handleBack,
  handleNextStep,
}: StepperContext<NewMeetupState>): JSX.Element => {
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

  const renderForm = ({
    touched,
    errors,
    isSubmitting,
  }: FormikProps<MeetupRequiredFields>): JSX.Element => {
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
            Новый митап
          </Typography>
          <Typography
            className={styles.subTitle}
            component={TypographyComponent.Paragraph}
          >
            Заполните поля ниже наиболее подробно, это даст полную информацию о
            предстоящем событии.
          </Typography>
        </div>
        <div className={styles.contentWrapper}>
          <div className={classNames(styles.textSection, styles.main)}>
            <TextField name="subject" labelText="Название" />
            <TextField name="author" labelText="Спикер" />
            <TextField name="excerpt" labelText="Описание" multiline />
          </div>
          <div className={classNames(styles.textSection, styles.actions)}>
            <Button
              type="button"
              onClick={handleBack}
              variant={ButtonVariant.Default}
              className={classNames(styles.actionButton, styles.back)}
            >
              Назад
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              className={classNames(styles.actionButton, styles.next)}
              disabled={!canSubmit}
            >
              Далее
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  return (
    <Formik<MeetupRequiredFields>
      initialValues={initialValues}
      validationSchema={meetupRequiredFieldsSchema}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  );
};
