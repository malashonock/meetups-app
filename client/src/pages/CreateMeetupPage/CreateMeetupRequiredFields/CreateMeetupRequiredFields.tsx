import { useEffect } from 'react';
import classNames from 'classnames';
import { FormikProps } from 'formik';
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
import { MeetupFields } from 'model';
import { useTouchOnLocaleChanged, useLocale, useUserStore } from 'hooks';
import { User } from 'stores';
import { Nullable } from 'types';

import styles from './CreateMeetupRequiredFields.module.scss';

export const CreateMeetupRequiredFields = ({
  dataContext: { errors, touched, isValidating, isSubmitting, setFieldTouched },
  activeStep,
  setStepPassed,
  handleBack,
  handleNextStep,
}: StepperContext<FormikProps<MeetupFields>>): JSX.Element => {
  const { users } = useUserStore();
  const { t } = useTranslation();
  const [locale] = useLocale();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

  const isTouched = Object.entries(touched).length > 0;
  const hasErrors = Object.entries(errors).length > 0;
  const isPassed =
    (isTouched || activeStep.passed) && !(isValidating || hasErrors);
  const canSubmit = isPassed && !isSubmitting;

  useEffect(() => {
    if (!isValidating) {
      setStepPassed(activeStep.index, isPassed);
    }
  }, [isValidating, isPassed, activeStep.index, setStepPassed]);

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
          <TextField
            name="subject"
            labelText={t('formFields.meetup.topic.label') || 'Topic'}
          />
          <SelectField<User>
            name="speakers"
            labelText={t('formFields.meetup.speakers.label') || 'Speaker(s)'}
            placeholderText={
              t('formFields.meetup.speakers.placeholder') ||
              'Select speaker(s)...'
            }
            selectProps={{
              isMulti: true,
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
            id="btn-back"
            type="button"
            onClick={handleBack}
            variant={ButtonVariant.Default}
            className={classNames(styles.actionButton, styles.back)}
          >
            {t('formButtons.back')}
          </Button>
          <Button
            id="btn-next"
            type="submit"
            onClick={handleNextStep}
            variant={ButtonVariant.Primary}
            className={classNames(styles.actionButton, styles.next)}
            disabled={!canSubmit}
          >
            {t('formButtons.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};
