import classNames from 'classnames';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';

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

import styles from './CreateMeetupOptionalFields.module.scss';
import { MeetupOptionalFields, validateMeetupOptionalFields } from 'validation';

export const CreateMeetupOptionalFields = ({
  dataContext: [newMeetupData, setNewMeetupData],
  activeStep,
  setStepPassed,
  handlePreviousStep,
  handleFinish,
}: StepperContext<NewMeetupState>): JSX.Element => {
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

  const renderForm = ({
    errors,
    values,
    isSubmitting,
  }: FormikProps<MeetupOptionalFields>): JSX.Element => {
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
            <div className={styles.dates}>
              <DateTimePicker name="start" labelText="Начало" />
              <DateTimePicker name="finish" labelText="Окончание" />
            </div>
            <TextField name="place" labelText="Место проведения" />
            <ImageUploader
              name="image"
              variant={ImagePreviewMode.Thumbnail}
              labelText={values.image ? 'Загруженные изображения' : ''}
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
              Назад
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              className={classNames(styles.actionButton, styles.next)}
              disabled={!canSubmit}
            >
              Создать
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  return (
    <Formik<MeetupOptionalFields>
      initialValues={initialValues}
      validate={validateMeetupOptionalFields}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  );
};
