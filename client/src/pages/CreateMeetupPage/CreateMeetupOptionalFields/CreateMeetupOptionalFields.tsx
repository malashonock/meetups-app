import { useEffect } from 'react';
import classNames from 'classnames';
import { FormikProps } from 'formik';

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
import { NewMeetup } from 'model';

import styles from './CreateMeetupOptionalFields.module.scss';

export const CreateMeetupOptionalFields = ({
  dataContext: { values, errors, isSubmitting, setTouched },
  activeStep,
  setStepPassed,
  handlePreviousStep,
  handleFinish,
}: StepperContext<FormikProps<NewMeetup>>): JSX.Element => {
  // Clear validation state on mount
  useEffect(() => {
    setTouched({});
  }, []);

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
            type="submit"
            onClick={handlePreviousStep}
            variant={ButtonVariant.Default}
            className={classNames(styles.actionButton, styles.back)}
            disabled={!canSubmit}
          >
            Назад
          </Button>
          <Button
            type="submit"
            onClick={handleFinish}
            variant={ButtonVariant.Primary}
            className={classNames(styles.actionButton, styles.next)}
            disabled={!canSubmit}
          >
            Создать
          </Button>
        </div>
      </div>
    </div>
  );
};
