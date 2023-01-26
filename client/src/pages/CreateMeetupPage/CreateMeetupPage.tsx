import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { Stepper, StepperContext } from 'components';
import { CreateMeetupOptionalFields } from './CreateMeetupOptionalFields/CreateMeetupOptionalFields';
import { CreateMeetupRequiredFields } from './CreateMeetupRequiredFields/CreateMeetupRequiredFields';
import { MeetupFields } from 'model';
import { useAuthStore, useMeetupStore } from 'hooks';

import styles from './CreateMeetupPage.module.scss';

export type NewMeetupState = [
  newMeetupData: MeetupFields,
  setNewMeetupData: Dispatch<SetStateAction<MeetupFields>>,
];

export const CreateMeetupPage = observer((): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const { meetupStore } = useMeetupStore();

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
        steps={[
          {
            title: 'Обязательные поля',
            render: (context: StepperContext<NewMeetupState>): JSX.Element => (
              <CreateMeetupRequiredFields {...context} />
            ),
          },
          {
            title: 'Дополнительные поля',
            render: (context: StepperContext<NewMeetupState>): JSX.Element => (
              <CreateMeetupOptionalFields {...context} />
            ),
          },
        ]}
        dataContext={[newMeetupData, setNewMeetupData]}
        onFinish={async () => {
          setFinished(true);
        }}
      />
    </div>
  );
});
