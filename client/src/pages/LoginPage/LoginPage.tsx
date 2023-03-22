import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { Credentials } from 'model';
import { useAuthStore, useLocale, useTouchOnLocaleChanged } from 'hooks';
import { loginSchema } from 'validation';

import { ReactComponent as AnonymousUserIcon } from 'assets/images/anonymous-user.svg';
import styles from './LoginPage.module.scss';

const LoginForm = ({
  touched,
  errors,
  isSubmitting,
  setFieldTouched,
}: FormikProps<Credentials>): JSX.Element => {
  const [locale] = useLocale();
  const { t } = useTranslation();
  useTouchOnLocaleChanged(locale, errors, touched, setFieldTouched);

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
          {t('loginPage.title')}
        </Typography>
        <div className={styles.contentWrapper}>
          <div className={classNames(styles.textSection, styles.main)}>
            <figure className={classNames(styles.section, styles.imageWrapper)}>
              <AnonymousUserIcon className={styles.image} />
            </figure>
            <TextField
              name="username"
              labelText={t('formFields.login.username.label') || 'User name'}
            />
            <TextField
              name="password"
              type="password"
              labelText={t('formFields.login.password.label') || 'Password'}
            />
            <Button
              id="btn-login"
              type="submit"
              variant={ButtonVariant.Primary}
              className={styles.actionButton}
              disabled={!canSubmit}
            >
              {t('formButtons.login')}
            </Button>
          </div>
        </div>
      </section>
    </Form>
  );
};

export const LoginPage = observer((): JSX.Element => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { i18n } = useTranslation();

  const initialValues: Credentials = {
    username: '',
    password: '',
  };

  const handleSubmit = async (
    credentials: Credentials,
    { setSubmitting }: FormikHelpers<Credentials>,
  ): Promise<void> => {
    await authStore.logIn(credentials);
    setSubmitting(false);
    if (!authStore.isError) {
      navigate('/meetups');
    }
  };

  return (
    <Formik<Credentials>
      initialValues={initialValues}
      validationSchema={loginSchema(i18n)}
      onSubmit={handleSubmit}
    >
      {(formikProps: FormikProps<Credentials>) => (
        <LoginForm {...formikProps} />
      )}
    </Formik>
  );
});
