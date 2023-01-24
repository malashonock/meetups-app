import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';

import {
  Button,
  ButtonVariant,
  ImagePreviewMode,
  ImageUploader,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NotFoundPage } from 'pages';
import { NewsFields } from 'model';
import { useNewsArticle } from 'hooks';
import { newsSchema } from 'validation';

import styles from './EditNewsPage.module.scss';

export const EditNewsPage = observer((): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();

  const newsArticle = useNewsArticle(id);

  if (!newsArticle) {
    return <NotFoundPage />;
  }

  const initialValues: NewsFields = {
    title: newsArticle.title || '',
    text: newsArticle.text || '',
    image: newsArticle.image,
  };

  const handleBack = (): void => navigate(-1);

  const handleSubmit = async (
    updatedArticleData: NewsFields,
    { setSubmitting }: FormikHelpers<NewsFields>,
  ): Promise<void> => {
    await newsArticle.update(updatedArticleData);
    setSubmitting(false);
    navigate('/news');
  };

  const renderForm = ({
    touched,
    dirty,
    errors,
    isSubmitting,
  }: FormikProps<NewsFields>): JSX.Element => {
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
            Редактирование новости
          </Typography>
          <div className={styles.contentWrapper}>
            <div className={classNames(styles.textSection, styles.main)}>
              <ImageUploader
                name="image"
                labelText="Изображение"
                variant={ImagePreviewMode.Large}
              />
              <TextField name="title" labelText="Заголовок" />
              <TextField name="text" labelText="Текст" multiline />
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
