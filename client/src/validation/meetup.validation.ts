import { FormikErrors } from 'formik';
import * as yup from 'yup';

import { MeetupFields } from 'model';
import { SECONDS_IN_MINUTE, MILLISECONDS_IN_SECOND } from 'utils';

export type MeetupRequiredFields = Pick<
  MeetupFields,
  'author' | 'subject' | 'excerpt'
>;

export type MeetupOptionalFields = Pick<
  MeetupFields,
  'start' | 'finish' | 'place' | 'image'
>;

export const meetupRequiredFieldsSchema = yup.object().shape({
  author: yup
    .object()
    .shape({
      id: yup.string().required(),
      name: yup.string().required(),
      surname: yup.string().required(),
    })
    .required('Необходимо указать спикера'),
  subject: yup.string().required('Необходимо заполнить тему митапа'),
  excerpt: yup.string().required('Необходимо заполнить описание митапа'),
});

export const validateMeetupOptionalFields = ({
  start,
  finish,
}: MeetupOptionalFields): FormikErrors<MeetupOptionalFields> => {
  const errors: FormikErrors<MeetupOptionalFields> = {};

  if (!start && finish) {
    errors.start = 'Заполните дату начала митапа';
  }

  if (
    start &&
    finish &&
    finish <
      new Date(
        start.getTime() + 15 * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
      )
  ) {
    errors.finish = 'Дата окончания не может быть меньше даты начала';
  }

  return errors;
};
