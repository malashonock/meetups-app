import { useNavigate, useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  ImagePreviewMode,
  ImageUploader,
  LoadingSpinner,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { NotFoundPage } from 'pages';
import { NewsFields } from 'model';
import { useNewsArticle, useTouchOnLocaleChanged, useLocale } from 'hooks';
import { newsSchema } from 'validation';

import styles from './EditNewsPage.module.scss';

const EditNewsForm = ({
  touched,
  dirty,
  errors,
  isSubmitting,
  setFieldTouched,
}: FormikProps<NewsFields>): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [locale] = useLocale();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

  const isTouched = Object.entries(touched).length > 0;
  const hasErrors = Object.entries(errors).length > 0;
  const canSubmit = isTouched && dirty && !hasErrors && !isSubmitting;

  const handleBack = (): void => navigate(-1);

  return (
    <Form>
      <section className={styles.container}>
        <Typography
          className={styles.heading}
          component={TypographyComponent.Heading1}
        >
          {t('editNewsPage.title')}
        </Typography>
        <div className={styles.contentWrapper}>
          <div className={classNames(styles.textSection, styles.main)}>
            <ImageUploader
              name="image"
              labelText={t('formFields.news.image.label') || 'Image'}
              variant={ImagePreviewMode.Large}
            />
            <TextField
              name="title"
              labelText={t('formFields.news.title.label') || 'Title'}
            />
            <TextField
              name="text"
              labelText={t('formFields.news.text.label') || 'Text'}
              multiline
            />
          </div>
          <div className={classNames(styles.textSection, styles.actions)}>
            <Button
              id="btn-cancel"
              type="button"
              variant={ButtonVariant.Default}
              onClick={handleBack}
              className={styles.actionButton}
            >
              {t('formButtons.cancel')}
            </Button>
            <Button
              id="btn-save"
              type="submit"
              variant={ButtonVariant.Primary}
              className={styles.actionButton}
              disabled={!canSubmit}
            >
              {t('formButtons.save')}
            </Button>
          </div>
        </div>
      </section>
    </Form>
  );
};

export const EditNewsPage = observer((): JSX.Element => {
  const { id } = useParams();
  const { newsArticle, isLoading, isError } = useNewsArticle(id);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner text={t('loadingText.newsArticle')} />;
  }

  if (!newsArticle || isError) {
    return <NotFoundPage />;
  }

  const initialValues: NewsFields = {
    title: newsArticle.title || '',
    text: newsArticle.text || '',
    image: newsArticle.image,
  };

  const handleSubmit = async (
    updatedArticleData: NewsFields,
    { setSubmitting }: FormikHelpers<NewsFields>,
  ): Promise<void> => {
    await newsArticle.update(updatedArticleData);
    setSubmitting(false);
    navigate('/news');
  };

  return (
    <Formik<NewsFields>
      initialValues={initialValues}
      validationSchema={newsSchema(i18n)}
      onSubmit={handleSubmit}
    >
      {(formikProps: FormikProps<NewsFields>) => (
        <EditNewsForm {...formikProps} />
      )}
    </Formik>
  );
});
