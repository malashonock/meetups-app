import * as yup from 'yup';

export const newsSchema = yup.object().shape({
  title: yup.string().required('Введите заголовок новости'),
  text: yup.string().required('Введите текст новости'),
});
