import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';

import {
  Button,
  ButtonVariant,
  DateTimePicker,
  ImagePreviewMode,
  ImageUploader,
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
import { useMeetup } from 'hooks';

import styles from './EditMeetupPage.module.scss';

export const EditMeetupPage = observer((): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();

  const meetup = useMeetup(id);

  if (!meetup) {
    return <NotFoundPage />;
  }

  const initialValues: MeetupFields = {
    subject: meetup.subject || '',
    excerpt: meetup.excerpt || '',
    author: 'chief Blick', // TODO: replace with ShortUser
    start: meetup.start,
    finish: meetup.finish,
    place: meetup.place || '',
    image: meetup.image,
  };

  const handleBack = (): void => navigate(-1);

  const gotoPreview = (isDirty: boolean): void => {
    if (
      !isDirty ||
      window.confirm(
        'Несохраненные изменения будут потеряны. Все равно перейти к странице просмотра?',
      )
    ) {
      navigate(`/meetups/${id}`);
    }
  };

  const handleSubmit = async (
    updatedMeetupData: MeetupFields,
    { setTouched }: FormikHelpers<MeetupFields>,
  ): Promise<void> => {
    await meetup.update(updatedMeetupData);
    setTouched({});
  };

  const renderForm = ({
    touched,
    dirty,
    errors,
    isSubmitting,
  }: FormikProps<MeetupFields>): JSX.Element => {
    const isTouched = Object.entries(touched).length > 0;
    const hasErrors = Object.entries(errors).length > 0;
    const canSubmit = isTouched && dirty && !hasErrors && !isSubmitting;

    return (
      <Form>
        <section className={styles.container}>
          <Typography
            className={styles.heading}
            component={TypographyComponent.Heading1}
          >
            Редактирование митапа
          </Typography>
          <div className={styles.contentWrapper}>
            <div className={classNames(styles.textSection, styles.main)}>
              <ImageUploader
                name="image"
                labelText="Фото"
                variant={ImagePreviewMode.Large}
              />
              <TextField name="subject" labelText="Тема" />
              <div className={styles.dates}>
                <DateTimePicker name="start" labelText="Начало" />
                <DateTimePicker name="finish" labelText="Окончание" />
              </div>
              <TextField name="place" labelText="Место проведения" />
              <TextField name="author" labelText="Спикер" />
              <TextField name="excerpt" labelText="Описание" multiline />
            </div>
            <div className={classNames(styles.textSection, styles.actions)}>
              <Button
                type="button"
                variant={ButtonVariant.Default}
                onClick={handleBack}
                className={styles.actionButton}
              >
                Отмена
              </Button>
              <div className={styles.actionsWrapper}>
                <Button
                  type="button"
                  variant={ButtonVariant.Secondary}
                  onClick={() => gotoPreview(dirty)}
                  className={styles.actionButton}
                >
                  Предпросмотр
                </Button>
                <Button
                  type="submit"
                  variant={ButtonVariant.Primary}
                  className={styles.actionButton}
                  disabled={!canSubmit}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Form>
    );
  };

  return (
    <Formik<MeetupFields>
      initialValues={initialValues}
      validationSchema={meetupRequiredFieldsSchema}
      validate={validateMeetupOptionalFields}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  );
});
