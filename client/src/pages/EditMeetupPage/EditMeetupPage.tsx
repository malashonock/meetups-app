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
import { useMeetup, useUserStore } from 'hooks';
import { Nullable } from 'types';

import styles from './EditMeetupPage.module.scss';

export const EditMeetupPage = observer((): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();

  const meetup = useMeetup(id);
  const { users } = useUserStore();

  if (!meetup) {
    return <NotFoundPage />;
  }

  const initialValues: MeetupFields = {
    subject: meetup.subject || '',
    excerpt: meetup.excerpt || '',
    author: meetup.author,
    start: meetup.start,
    finish: meetup.finish,
    place: meetup.place || '',
    image: meetup.image,
  };

  const handleBack = (): void => navigate(-1);

  const gotoPreview = (): void => {
    navigate(`/meetups/${id}`);
  };

  const handleSubmit = async (
    updatedMeetupData: MeetupFields,
    { setTouched, resetForm }: FormikHelpers<MeetupFields>,
  ): Promise<void> => {
    await meetup.update(updatedMeetupData);
    resetForm({
      values: updatedMeetupData,
    });
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
              <SelectField<User>
                name="author"
                labelText="Спикер"
                placeholderText="Выберите спикера..."
                selectProps={{
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
                  onClick={gotoPreview}
                  className={styles.actionButton}
                  disabled={dirty}
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
