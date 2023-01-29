import classNames from 'classnames';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  DateTimePicker,
  ImagePreviewMode,
  ImageUploader,
  StepperContext,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NewMeetupState } from 'pages';
import { MeetupOptionalFields, validateMeetupOptionalFields } from 'validation';
import { useUiStore, useTouchOnLocaleChanged } from 'hooks';

import styles from './CreateMeetupOptionalFields.module.scss';

interface CreateMeetupOptionalFieldsProps {
  context: StepperContext<NewMeetupState>;
  formikProps: FormikProps<MeetupOptionalFields>;
}

const CreateMeetupOptionalFieldsForm = ({
  context,
  formikProps,
}: CreateMeetupOptionalFieldsProps): JSX.Element => {
  const {
    dataContext: [newMeetupData, setNewMeetupData],
    activeStep,
    setStepPassed,
    handlePreviousStep,
  } = context;

  const { errors, values, touched, isSubmitting, setFieldTouched } =
    formikProps;

  const { t } = useTranslation();
  const { locale } = useUiStore();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

  const hasErrors = Object.entries(errors).length > 0;
  const isPassed = !hasErrors;
  const canSubmit = isPassed && !isSubmitting;

  // sync stepper state
  if (isPassed !== activeStep.passed) {
    // mute console error
    setTimeout(() => setStepPassed(activeStep.index, canSubmit), 0);
  }

  const handleBack = (): void => {
    // save step values if they are valid
    if (canSubmit) {
      // mute console error
      setTimeout(
        () =>
          setNewMeetupData({
            ...newMeetupData,
            ...values,
          }),
        0,
      );
    }
    handlePreviousStep();
  };

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
          <div className={styles.dates}>
            <DateTimePicker
              name="start"
              labelText={t('formFields.meetup.datetimeStart.label') || 'Start'}
            />
            <DateTimePicker
              name="finish"
              labelText={
                t('formFields.meetup.datetimeFinish.label') || 'Finish'
              }
            />
          </div>
          <TextField
            name="place"
            labelText={t('formFields.meetup.location.label') || 'Location'}
          />
          <ImageUploader
            name="image"
            variant={ImagePreviewMode.Thumbnail}
            labelText={
              values.image
                ? t('formFields.meetup.image.label') || 'Uploaded images'
                : ''
            }
            containerAttributes={{
              className: classNames(styles.imageUploader, {
                [styles.imageUploaded]: values.image !== null,
              }),
            }}
          />
        </div>
        <div className={classNames(styles.textSection, styles.actions)}>
          <Button
            type="button"
            onClick={handleBack}
            variant={ButtonVariant.Default}
            className={classNames(styles.actionButton, styles.back)}
            disabled={!canSubmit}
          >
            {t('formButtons.back')}
          </Button>
          <Button
            type="submit"
            variant={ButtonVariant.Primary}
            className={classNames(styles.actionButton, styles.next)}
            disabled={!canSubmit}
          >
            {t('formButtons.create')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export const CreateMeetupOptionalFields = (
  context: StepperContext<NewMeetupState>,
): JSX.Element => {
  const { i18n } = useTranslation();

  const {
    dataContext: [newMeetupData, setNewMeetupData],
    handleFinish,
  } = context;

  const { start, finish, place, image } = newMeetupData;

  const initialValues: MeetupOptionalFields = {
    start,
    finish,
    place,
    image,
  };

  const handleSubmit = (
    values: MeetupOptionalFields,
    { setSubmitting }: FormikHelpers<MeetupOptionalFields>,
  ): void => {
    setNewMeetupData({
      ...newMeetupData,
      ...values,
    });
    setSubmitting(false);
    handleFinish();
  };

  return (
    <Formik<MeetupOptionalFields>
      initialValues={initialValues}
      validate={validateMeetupOptionalFields(i18n)}
      onSubmit={handleSubmit}
    >
      {(formikProps: FormikProps<MeetupOptionalFields>) => (
        <CreateMeetupOptionalFieldsForm
          context={context}
          formikProps={formikProps}
        />
      )}
    </Formik>
  );
};
