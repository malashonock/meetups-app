import { useEffect } from 'react';
import classNames from 'classnames';
import { FormikProps } from 'formik';
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
import { MeetupFields } from 'model';
import { useUiStore, useTouchOnLocaleChanged } from 'hooks';

import styles from './CreateMeetupOptionalFields.module.scss';

export const CreateMeetupOptionalFields = ({
  dataContext: { values, errors, touched, isSubmitting, setFieldTouched },
  activeStep,
  setStepPassed,
  handlePreviousStep,
  handleFinish,
}: StepperContext<FormikProps<MeetupFields>>): JSX.Element => {
  const { t } = useTranslation();
  const { locale } = useUiStore();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

  const hasErrors = Object.entries(errors).length > 0;
  const isPassed = !hasErrors;
  const canSubmit = isPassed && !isSubmitting;

  useEffect(() => {
    setStepPassed(activeStep.index, isPassed);
  }, [isPassed]);

  return (
    <div className={styles.container}>
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
            type="submit"
            onClick={handlePreviousStep}
            variant={ButtonVariant.Default}
            className={classNames(styles.actionButton, styles.back)}
            disabled={!canSubmit}
          >
            {t('formButtons.back')}
          </Button>
          <Button
            type="submit"
            onClick={handleFinish}
            variant={ButtonVariant.Primary}
            className={classNames(styles.actionButton, styles.next)}
            disabled={!canSubmit}
          >
            {t('formButtons.create')}
          </Button>
        </div>
      </div>
    </div>
  );
};
