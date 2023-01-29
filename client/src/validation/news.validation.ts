import * as yup from 'yup';
import { i18n } from 'i18next';

export const newsSchema = ({ t }: i18n) =>
  yup.object().shape({
    title: yup
      .string()
      .required(
        t('formFields.news.title.errorText') || 'News title is required',
      ),
    text: yup
      .string()
      .required(t('formFields.news.text.errorText') || 'News text is required'),
  });
