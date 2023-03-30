// Inspired by: https://medium.com/code-divoire/how-to-internationalize-a-yup-validation-schema-in-a-react-formik-and-react-i18next-app-689ff3cd978
import { useEffect } from 'react';
import { FormikErrors, FormikTouched } from 'formik';

export const useTouchOnLocaleChanged = <T>(
  locale: string | undefined,
  errors: FormikErrors<T>,
  touched: FormikTouched<T>,
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean,
  ) => void,
) => {
  useEffect(() => {
    Object.keys(errors).forEach((fieldName: string): void => {
      if (Object.keys(touched).includes(fieldName)) {
        setFieldTouched(fieldName);
      }
    });
  }, [locale, errors, touched, setFieldTouched]);
};
