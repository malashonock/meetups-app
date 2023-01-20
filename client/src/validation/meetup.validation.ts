import { FormikErrors } from 'formik';
import * as yup from 'yup';

import { MeetupFields } from 'model';
import { SECONDS_IN_MINUTE, MILLISECONDS_IN_SECOND } from 'helpers';

export type CreateMeetupRequiredValues = Pick<
  MeetupFields,
  'author' | 'subject' | 'excerpt'
>;

export type CreateMeetupOptionalValues = Pick<
  MeetupFields,
  'start' | 'finish' | 'place' | 'image'
>;

export const meetupRequiredFieldsSchema = yup.object().shape({
  author: yup.string().required('Необходимо указать спикера'),
  subject: yup.string().required('Необходимо заполнить тему митапа'),
  excerpt: yup.string().required('Необходимо заполнить описание митапа'),
});

export const validateMeetupOptionalFields = ({
  start,
  finish,
}: CreateMeetupOptionalValues): FormikErrors<CreateMeetupOptionalValues> => {
  const errors: FormikErrors<CreateMeetupOptionalValues> = {};

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
