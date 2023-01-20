import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().required('Введите имя пользователя'),
  password: yup.string().required('Введите пароль'),
});
