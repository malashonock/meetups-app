import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { i18n } from 'i18next';

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

export const meetupRequiredFieldsSchema = ({ t }: i18n) =>
  yup.object().shape({
    author: yup
      .object()
      .typeError(
        t('formFields.meetup.speaker.errorText') || 'Speaker is required',
      )
      .shape({
        id: yup.string().required(),
        name: yup.string().required(),
        surname: yup.string().required(),
      }),
    subject: yup
      .string()
      .required(
        t('formFields.meetup.topic.errorText') || 'Meetup topic is required',
      ),
    excerpt: yup
      .string()
      .required(
        t('formFields.meetup.description.errorText') ||
          'Meetup description is required',
      ),
  });

export const validateMeetupOptionalFields =
  ({ t }: i18n) =>
  ({
    start,
    finish,
  }: MeetupOptionalFields): FormikErrors<MeetupOptionalFields> => {
    const errors: FormikErrors<MeetupOptionalFields> = {};

    if (!start && finish) {
      errors.start =
        t('formFields.meetup.datetimeStart.errorText') ||
        'Start date is required';
    }

    if (
      start &&
      finish &&
      finish <
        new Date(
          start.getTime() + 15 * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
        )
    ) {
      errors.finish =
        t('formFields.meetup.datetimeFinish.errorText') ||
        'Finish date must be later than start date';
    }

    return errors;
  };
