import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MeetupCard } from 'components';
import { Meetup, MeetupStatus, ShortUser } from 'model';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/MeetupCard',
  component: MeetupCard,
  decorators: [withRouter],
} as ComponentMeta<typeof MeetupCard>;

const Template: ComponentStory<typeof MeetupCard> = (args) => (
  <div
    style={{
      width: '100%',
      maxWidth: '550px',
      margin: '0 auto',
    }}
  >
    <MeetupCard {...args} />
  </div>
);

const author: ShortUser = {
  id: 'AAA-AAA',
  name: 'Joe',
  surname: 'Jackson',
};

const meetupTopicNoExcerpt: Meetup = {
  id: 'AAA-AAA',
  status: MeetupStatus.DRAFT,
  author,
  subject: 'EF Core от практикующих',
  modified: new Date().toLocaleString(),
  speakers: [],
  goCount: 23,
};

const meetupTopicWithExcerpt: Meetup = {
  ...meetupTopicNoExcerpt,
  excerpt:
    'Основные темы, которые буду рассказывать: Database-first (EF Core), Db migrations, Software triggers, DbSet pre-filter (tenant-solution)',
};

const meetupOnModerationNoDate: Meetup = {
  ...meetupTopicWithExcerpt,
  status: MeetupStatus.REQUEST,
};

const meetupOnModeration: Meetup = {
  ...meetupOnModerationNoDate,
  start: new Date(2022, 3, 23, 15, 0).toISOString(),
};

const meetupUpcoming: Meetup = {
  ...meetupOnModeration,
  status: MeetupStatus.CONFIRMED,
  place: 'комн. 601b',
};

const meetupFinished: Meetup = {
  ...meetupUpcoming,
};

export const MeetupCard_Topic_NoExcerpt = Template.bind({});

MeetupCard_Topic_NoExcerpt.args = {
  meetup: meetupTopicNoExcerpt,
};

export const MeetupCard_Topic_WithExcerpt = Template.bind({});

MeetupCard_Topic_WithExcerpt.args = {
  meetup: meetupTopicWithExcerpt,
};

export const MeetupCard_OnModerationNoDate = Template.bind({});

MeetupCard_OnModerationNoDate.args = {
  meetup: meetupOnModerationNoDate,
};

export const MeetupCard_OnModeration = Template.bind({});

MeetupCard_OnModeration.args = {
  meetup: meetupOnModeration,
};

export const MeetupCard_Upcoming = Template.bind({});

MeetupCard_Upcoming.args = {
  meetup: meetupUpcoming,
};

export const MeetupCard_Finished = Template.bind({});

MeetupCard_Finished.args = {
  meetup: meetupFinished,
};
