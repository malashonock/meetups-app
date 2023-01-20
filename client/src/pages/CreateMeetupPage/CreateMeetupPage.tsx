import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stepper, StepperContext } from 'components';
import { CreateMeetupOptionalFields } from './CreateMeetupOptionalFields/CreateMeetupOptionalFields';
import { CreateMeetupRequiredFields } from './CreateMeetupRequiredFields/CreateMeetupRequiredFields';
import { MeetupStatus, MeetupFields } from 'model';
import { createMeetup } from 'api';

import styles from './CreateMeetupPage.module.scss';

export type NewMeetupState = [
  newMeetupData: MeetupFields,
  setNewMeetupData: Dispatch<SetStateAction<MeetupFields>>,
];

export const CreateMeetupPage = (): JSX.Element => {
  const [newMeetupData, setNewMeetupData] = useState<MeetupFields>({
    author: '',
    modified: new Date(),
    status: MeetupStatus.REQUEST,
    subject: '',
    excerpt: '',
    speakers: [],
    votedUsers: [],
    goCount: 0,
    place: '',
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
