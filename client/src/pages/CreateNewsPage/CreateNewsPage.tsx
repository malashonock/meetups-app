import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';

import {
  Button,
  ButtonVariant,
  ImagePreviewMode,
  ImageUploader,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NewsFields } from 'model';
import { useNewsStore } from 'hooks';
import { newsSchema } from 'validation';

import styles from './CreateNewsPage.module.scss';

export const CreateNewsPage = observer((): JSX.Element => {
  const { newsStore } = useNewsStore();
  const navigate = useNavigate();

  const initialValues: NewsFields = {
    title: '',
    text: '',
    image: null,
  };

  const handleBack = (): void => navigate(-1);

  const handleSubmit = async (newArticleData: NewsFields): Promise<void> => {
    await newsStore?.createNewsArticle(newArticleData);
    navigate('/news');
  };

  const renderForm = ({
    touched,
    errors,
    isSubmitting,
  }: FormikProps<NewsFields>): JSX.Element => {
    const isTouched = Object.entries(touched).length > 0;
    const hasErrors = Object.entries(errors).length > 0;
    const canSubmit = isTouched && !hasErrors && !isSubmitting;

    return (
      <Form>
        <section className={styles.container}>
          <Typography
            className={styles.heading}
            component={TypographyComponent.Heading1}
          >
            Создание новости
          </Typography>
          <div className={styles.contentWrapper}>
            <div className={classNames(styles.textSection, styles.main)}>
              <TextField name="title" labelText="Заголовок" />
              <TextField name="text" labelText="Текст" multiline />
              <ImageUploader
                name="image"
                labelText="Изображение"
                variant={ImagePreviewMode.Large}
              />
            </div>
            <div className={classNames(styles.textSection, styles.actions)}>
              <Button
                type="button"
                variant={ButtonVariant.Default}
                onClick={handleBack}
                className={styles.actionButton}
              >
                Назад
              </Button>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                className={styles.actionButton}
                disabled={!canSubmit}
              >
                Создать
              </Button>
            </div>
          </div>
        </section>
      </Form>
    );
  };

  return (
    <Formik<NewsFields>
      initialValues={initialValues}
      validationSchema={newsSchema}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  );
});
