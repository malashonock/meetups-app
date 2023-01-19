import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import {
  Button,
  ButtonVariant,
  ImagePreviewMode,
  ImageUploader,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NewNews, News } from 'model';
import { getNewsArticle, getStaticFile, updateNewsArticle } from 'api';
import { getFileWithUrl } from 'helpers';

import styles from './EditNewsPage.module.scss';

const validationSchema = yup.object().shape({
  title: yup.string().required('Введите заголовок новости'),
  text: yup.string().required('Введите текст новости'),
});

export const EditNewsPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState<News | null>(null);
  const [image, setImage] = useState<File | null>(null);

  // fetch news article by id
  useEffect((): void => {
    (async () => {
      if (!id) {
        return;
      }

      setNews(await getNewsArticle(id));
    })();
  }, [id]);

  // fetch image by url
  useEffect((): void => {
    (async () => {
      if (!news) {
        return;
      }

      const { imageUrl } = news;

      if (!imageUrl) {
        return;
      }

      const image = await getStaticFile(imageUrl);
      setImage(getFileWithUrl(image, imageUrl));
    })();
  }, [news?.imageUrl]);

  if (!news || !id || (news.imageUrl && !image)) {
    return <div>Загрузка...</div>;
  }

  const initialValues: NewNews = {
    title: news.title || '',
    text: news.text || '',
    image,
  };

  const handleBack = (): void => navigate(-1);

  const handleSubmit = async (
    updatedArticleData: NewNews,
    { setSubmitting }: FormikHelpers<NewNews>,
  ): Promise<void> => {
    await updateNewsArticle(id, updatedArticleData);
    setSubmitting(false);
    navigate('/news');
  };

  const renderForm = ({
    touched,
    dirty,
    errors,
    isSubmitting,
  }: FormikProps<NewNews>): JSX.Element => {
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
    <Formik<NewNews>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  );
};
