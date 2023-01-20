import { useEffect } from 'react';
import classNames from 'classnames';
import { FormikProps } from 'formik';

import {
  Button,
  ButtonVariant,
  StepperContext,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NewMeetup } from 'model';

import styles from './CreateMeetupRequiredFields.module.scss';

export const CreateMeetupRequiredFields = ({
  dataContext: { errors, touched, isSubmitting, setTouched },
  activeStep,
  setStepPassed,
  handleBack,
  handleNextStep,
}: StepperContext<FormikProps<NewMeetup>>): JSX.Element => {
  // Clear validation state on mount
  useEffect(() => {
    setTouched({});
  }, []);

  const isTouched = Object.entries(touched).length > 0;
  const hasErrors = Object.entries(errors).length > 0;
  const isPassed = (isTouched || activeStep.passed) && !hasErrors;
  const canSubmit = isPassed && !hasErrors && !isSubmitting;

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
            onClick={handleNextStep}
            variant={ButtonVariant.Primary}
            className={classNames(styles.actionButton, styles.next)}
            disabled={!canSubmit}
          >
            Далее
          </Button>
        </div>
      </div>
    </div>
  );
};
