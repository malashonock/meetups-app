import classNames from 'classnames';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';

import {
  Button,
  ButtonVariant,
  StepperContext,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NewMeetup } from 'model';
import { NewMeetupState } from 'pages';

import styles from './CreateMeetupRequiredFields.module.scss';

type CreateMeetupRequiredValues = Pick<
  NewMeetup,
  'author' | 'subject' | 'excerpt'
>;

export const CreateMeetupRequiredFields = ({
  dataContext: [newMeetupData, setNewMeetupData],
  activeStep,
  setStepPassed,
  handleBack,
  handleNextStep,
}: StepperContext<NewMeetupState>): JSX.Element => {
  const { author, subject, excerpt } = newMeetupData;

  const initialValues: CreateMeetupRequiredValues = {
    author,
    subject,
    excerpt,
  };

  const handleSubmit = (
    values: CreateMeetupRequiredValues,
    { setSubmitting }: FormikHelpers<CreateMeetupRequiredValues>,
  ): void => {
    setNewMeetupData({
      ...newMeetupData,
      ...values,
    });
    setSubmitting(false);
    handleNextStep();
  };

  return (
    <Formik<CreateMeetupRequiredValues>
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        author: yup.string().required('Необходимо указать спикера'),
        subject: yup.string().required('Необходимо заполнить тему митапа'),
        excerpt: yup.string().required('Необходимо заполнить описание митапа'),
      })}
      onSubmit={handleSubmit}
    >
      {({ touched, errors, isSubmitting }) => {
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
                Заполните поля ниже наиболее подробно, это даст полную
                информацию о предстоящем событии.
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
      }}
    </Formik>
  );
};
