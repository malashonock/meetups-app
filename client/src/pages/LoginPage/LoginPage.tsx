import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';

import { RootContext } from 'App';
import {
  Button,
  ButtonVariant,
  TextField,
  Typography,
  TypographyComponent,
} from 'components';
import { Credentials } from 'model';
import { loginSchema } from 'validation';

import { ReactComponent as AnonymousUserIcon } from 'assets/images/anonymous-user.svg';
import styles from './LoginPage.module.scss';

export const LoginPage = observer((): JSX.Element => {
  const navigate = useNavigate();
  const authStore = useContext(RootContext)?.authStore;

  const initialValues: Credentials = {
    username: '',
    password: '',
  };

  const handleSubmit = async (
    credentials: Credentials,
    { setSubmitting }: FormikHelpers<Credentials>,
  ): Promise<void> => {
    await authStore?.logIn(credentials);
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
});
