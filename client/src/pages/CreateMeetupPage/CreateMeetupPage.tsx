import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { i18n } from 'i18next';

import { StepConfig, Stepper, StepperContext } from 'components';
import { CreateMeetupOptionalFields } from './CreateMeetupOptionalFields/CreateMeetupOptionalFields';
import { CreateMeetupRequiredFields } from './CreateMeetupRequiredFields/CreateMeetupRequiredFields';
import { MeetupFields } from 'model';
import { useAuthStore, useMeetupStore } from 'hooks';

import styles from './CreateMeetupPage.module.scss';
import { useTranslation } from 'react-i18next';

export type NewMeetupState = [
  newMeetupData: MeetupFields,
  setNewMeetupData: Dispatch<SetStateAction<MeetupFields>>,
];

const createMeetupSteps: StepConfig<NewMeetupState>[] = [
  {
    title: ({ t }: i18n) => t('createMeetupPage.requiredFields.tabTitle'),
    render: (context: StepperContext<NewMeetupState>): JSX.Element => (
      <CreateMeetupRequiredFields {...context} />
    ),
  },
  {
    title: ({ t }: i18n) => t('createMeetupPage.optionalFields.tabTitle'),
    render: (context: StepperContext<NewMeetupState>): JSX.Element => (
      <CreateMeetupOptionalFields {...context} />
    ),
  },
];

export const CreateMeetupPage = observer((): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const { meetupStore } = useMeetupStore();
  const { t } = useTranslation();

  const [newMeetupData, setNewMeetupData] = useState<MeetupFields>({
    author: loggedUser ?? null,
    subject: '',
    excerpt: '',
    place: '',
    image: null,
  });

  const [finished, setFinished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (finished) {
      (async () => {
        const newMeetup = await meetupStore?.createMeetup(newMeetupData);
        navigate(newMeetup ? `/meetups/${newMeetup.id}` : '/meetups');
      })();
    }
  }, [finished]);

  return (
    <div className={styles.container}>
      <Stepper<NewMeetupState>
        steps={createMeetupSteps}
        dataContext={[newMeetupData, setNewMeetupData]}
        onFinish={async () => {
          setFinished(true);
        }}
      />
    </div>
  );
});
