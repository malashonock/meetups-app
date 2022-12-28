import { object, string } from 'yup';

export const validationSchema = object().shape({
  userValue: string().required('Please enter your value'),
});
