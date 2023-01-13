import { useNavigate } from 'react-router';
import classNames from 'classnames';
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

import styles from './CreateNewsPage.module.scss';
import { Form, Formik } from 'formik';
import { NewNews, News } from 'model';
import { createNewsArticle } from 'api';

export const CreateNewsPage = (): JSX.Element => {
  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);

  return (
    <Formik<NewNews>
      initialValues={{
        title: '',
        text: '',
        image: null,
      }}
      validationSchema={yup.object().shape({
        title: yup.string().required('Введите заголовок новости'),
        text: yup.string().required('Введите текст новости'),
      })}
      onSubmit={async (newArticleData, { setSubmitting }): Promise<void> => {
        const createdArticle: News = await createNewsArticle(newArticleData);
        alert(JSON.stringify(createdArticle));
        setSubmitting(false);
      }}
    >
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
              <ImageUploader name="image" labelText="Изображение" variant={ImagePreviewMode.Large} />
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
              >
                Создать
              </Button>
            </div>
          </div>
        </section>
      </Form>
    </Formik>
  );
};