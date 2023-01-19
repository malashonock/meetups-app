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

import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { NewNews } from 'model';
import { createNewsArticle } from 'api';

import styles from './CreateNewsPage.module.scss';

export const CreateNewsPage = (): JSX.Element => {
  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);
  
    const initialValues: NewNews = {
      title: '',
      text: '',
      image: null,
    };

  const handleSubmit = async (
    newArticleData: NewNews,
    { setSubmitting }: FormikHelpers<NewNews>,
  ): Promise<void> => {
    await createNewsArticle(newArticleData);
    setSubmitting(false);
    navigate('/news');
  };

  return (
    <Formik<NewNews>
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        title: yup.string().required('Введите заголовок новости'),
        text: yup.string().required('Введите текст новости'),
      })}
      onSubmit={handleSubmit}
    >
      {({ touched, errors, isSubmitting }: FormikProps<NewNews>) => {
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
      }}
    </Formik>
  );
};
