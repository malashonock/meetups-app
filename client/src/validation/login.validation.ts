import { i18n } from 'i18next';
import * as yup from 'yup';

export const loginSchema = ({ t }: i18n) =>
  yup.object().shape({
    username: yup
      .string()
      .required(
        t('formFields.login.username.errorText') || 'User name is required',
      ),
    password: yup
      .string()
      .required(
        t('formFields.login.password.errorText') || 'Password is required',
      ),
  });
