import { useNavigate } from 'react-router';
import classNames from 'classnames';
import * as yup from 'yup';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';

import {
  Button,
  ButtonVariant,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { Credentials } from 'model';
import { loginSchema } from 'validation';
import { login } from 'api';

import { ReactComponent as AnonymousUserIcon } from 'assets/images/anonymous-user.svg';
import styles from './LoginPage.module.scss';

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();

  const initialValues: Credentials = {
    username: '',
    password: '',
  };

  const handleSubmit = async (
    credentials: Credentials,
    { setSubmitting }: FormikHelpers<Credentials>,
  ): Promise<void> => {
    await login(credentials);
    setSubmitting(false);
    navigate('/meetups');
  };

  const renderForm = ({
    touched,
    errors,
    isSubmitting,
  }: FormikProps<Credentials>): JSX.Element => {
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
            Войти на сайт
          </Typography>
          <div className={styles.contentWrapper}>
            <div className={classNames(styles.textSection, styles.main)}>
              <figure
                className={classNames(styles.section, styles.imageWrapper)}
              >
                <AnonymousUserIcon className={styles.image} />
              </figure>
              <TextField name="username" labelText="Имя пользователя" />
              <TextField name="password" labelText="Пароль" />
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                className={styles.actionButton}
                disabled={!canSubmit}
              >
                Войти
              </Button>
            </div>
          </div>
        </section>
      </Form>
    );
  };

  return (
    <Formik<Credentials>
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Formik>
  );
};
