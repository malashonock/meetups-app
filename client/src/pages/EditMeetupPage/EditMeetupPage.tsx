import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  DateTimePicker,
  ImagePreviewMode,
  ImageUploader,
  LoadingSpinner,
  SelectField,
  SelectOption,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NotFoundPage } from 'pages';
import { MeetupFields } from 'model';
import {
  meetupRequiredFieldsSchema,
  validateMeetupOptionalFields,
} from 'validation';
import { User } from 'stores';
import {
  useMeetup,
  useTouchOnLocaleChanged,
  useLocale,
  useUserStore,
} from 'hooks';
import { Nullable } from 'types';

import styles from './EditMeetupPage.module.scss';

const EditMeetupForm = ({
  touched,
  dirty,
  errors,
  isSubmitting,
  setFieldTouched,
}: FormikProps<MeetupFields>): JSX.Element => {
  const { id } = useParams();
  const { users } = useUserStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [locale] = useLocale();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

  const isTouched = Object.entries(touched).length > 0;
  const hasErrors = Object.entries(errors).length > 0;
  const canSubmit = isTouched && dirty && !hasErrors && !isSubmitting;

  const handleBack = (): void => navigate(-1);

  const gotoPreview = (): void => {
    navigate(`/meetups/${id}`);
  };

  return (
    <Form>
      <section className={styles.container}>
        <Typography
          className={styles.heading}
          component={TypographyComponent.Heading1}
        >
          {t('editMeetupPage.title')}
        </Typography>
        <div className={styles.contentWrapper}>
          <div className={classNames(styles.textSection, styles.main)}>
            <ImageUploader
              name="image"
              labelText={t('formFields.meetup.image.label') || 'Image'}
              variant={ImagePreviewMode.Large}
            />
            <TextField
              name="subject"
              labelText={t('formFields.meetup.topic.label') || 'Topic'}
            />
            <div className={styles.dates}>
              <DateTimePicker
                name="start"
                labelText={
                  t('formFields.meetup.datetimeStart.label') || 'Start'
                }
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
              id="btn-cancel"
              type="button"
              variant={ButtonVariant.Default}
              onClick={handleBack}
              className={classNames(styles.actionButton, styles.cancelBtn)}
            >
              {t('formButtons.cancel')}
            </Button>
            <div className={styles.actionsWrapper}>
              <Button
                id="btn-preview"
                type="button"
                variant={ButtonVariant.Secondary}
                onClick={gotoPreview}
                className={classNames(styles.actionButton, styles.previewBtn)}
                disabled={dirty}
              >
                {t('formButtons.preview')}
              </Button>
              <Button
                id="btn-save"
                type="submit"
                variant={ButtonVariant.Primary}
                className={classNames(styles.actionButton, styles.saveBtn)}
                disabled={!canSubmit}
              >
                {t('formButtons.save')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Form>
  );
};

export const EditMeetupPage = observer((): JSX.Element => {
  const { id } = useParams();
  const { meetup, isInitialized, isLoading, isError } = useMeetup(id);
  const { i18n, t } = useTranslation();

  if (!meetup || !isInitialized || isLoading) {
    return <LoadingSpinner text={t('loadingText.meetup')} />;
  }

  if (isError) {
    return <NotFoundPage />;
  }

  const initialValues: MeetupFields = {
    subject: meetup.subject || '',
    excerpt: meetup.excerpt || '',
    author: meetup.author,
    speakers: meetup.speakers,
    start: meetup.start,
    finish: meetup.finish,
    place: meetup.place || '',
    image: meetup.image,
  };

  const handleSubmit = async (
    updatedMeetupData: MeetupFields,
    { resetForm }: FormikHelpers<MeetupFields>,
  ): Promise<void> => {
    await meetup.update(updatedMeetupData);
    resetForm({
      values: updatedMeetupData,
    });
  };

  return (
    <Formik<MeetupFields>
      initialValues={initialValues}
      validationSchema={meetupRequiredFieldsSchema(i18n)}
      validate={validateMeetupOptionalFields(i18n)}
      onSubmit={handleSubmit}
    >
      {(formikProps: FormikProps<MeetupFields>) => (
        <EditMeetupForm {...formikProps} />
      )}
    </Formik>
  );
});
