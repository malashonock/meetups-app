import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

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
import { useNewsStore, useTouchOnLocaleChanged, useUiStore } from 'hooks';
import { newsSchema } from 'validation';

import styles from './CreateNewsPage.module.scss';

const CreateNewsForm = ({
  touched,
  errors,
  isSubmitting,
  setFieldTouched,
}: FormikProps<NewsFields>): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useUiStore();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

  const isTouched = Object.entries(touched).length > 0;
  const hasErrors = Object.entries(errors).length > 0;
  const canSubmit = isTouched && !hasErrors && !isSubmitting;

  const handleBack = (): void => navigate(-1);

  return (
    <Form>
      <section className={styles.container}>
        <Typography
          className={styles.heading}
          component={TypographyComponent.Heading1}
        >
          {t('createNewsPage.title')}
        </Typography>
        <div className={styles.contentWrapper}>
          <div className={classNames(styles.textSection, styles.main)}>
            <TextField
              name="title"
              labelText={t('formFields.news.title.label') || 'Title'}
            />
            <TextField
              name="text"
              labelText={t('formFields.news.text.label') || 'Text'}
              multiline
            />
            <ImageUploader
              name="image"
              labelText={t('formFields.news.image.label') || 'Image'}
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
              {t('formButtons.back')}
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              className={styles.actionButton}
              disabled={!canSubmit}
            >
              {t('formButtons.create')}
            </Button>
          </div>
        </div>
      </section>
    </Form>
  );
};

export const CreateNewsPage = observer((): JSX.Element => {
  const { newsStore } = useNewsStore();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const initialValues: NewsFields = {
    title: '',
    text: '',
    image: null,
  };

  const handleSubmit = async (newArticleData: NewsFields): Promise<void> => {
    await newsStore?.createNewsArticle(newArticleData);
    navigate('/news');
  };

  return (
    <Formik<NewsFields>
      initialValues={initialValues}
      validationSchema={newsSchema(i18n)}
      onSubmit={handleSubmit}
    >
      {(formikProps: FormikProps<NewsFields>) => (
        <CreateNewsForm {...formikProps} />
      )}
    </Formik>
  );
});
