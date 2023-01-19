import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stepper, StepperContext } from 'components';
import { MeetupStatus, NewMeetup } from 'model';
import { createMeetup } from 'api';
import { CreateMeetupOptionalFields, CreateMeetupRequiredFields } from 'forms';

import styles from './CreateMeetupPage.module.scss';

export type NewMeetupState = [
  newMeetupData: NewMeetup,
  setNewMeetupData: Dispatch<SetStateAction<NewMeetup>>,
];

export const CreateMeetupPage = (): JSX.Element => {
  const [newMeetupData, setNewMeetupData] = useState<NewMeetup>({
    author: '',
    modified: new Date(),
    start: null,
    finish: null,
    status: MeetupStatus.REQUEST,
    subject: '',
    excerpt: '',
    speakers: [],
    votedUsers: [],
    goCount: 0,
    place: '',
    image: null,
  });

  const [finished, setFinished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (finished) {
      (async () => {
        await createMeetup(newMeetupData);
        navigate('/meetups');
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
};
