import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MeetupCard } from 'components';
import { MeetupStatus, ShortUser } from 'model';
import { Meetup } from 'stores';
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

const meetupTopic: Meetup = new Meetup({
  id: 'AAA-AAA',
  status: MeetupStatus.REQUEST,
  author,
  subject: 'EF Core от практикующих',
  excerpt:
    'Основные темы, которые буду рассказывать: Database-first (EF Core), Db migrations, Software triggers, DbSet pre-filter (tenant-solution)',
  modified: new Date(),
  speakers: [],
  votedUsers: [],
  participants: [],
  image: null,
});

const meetupOnModerationNoDate: Meetup = new Meetup({
  ...meetupTopic,
  status: MeetupStatus.REQUEST,
});

const meetupOnModeration: Meetup = new Meetup({
  ...meetupOnModerationNoDate,
  start: new Date(2022, 3, 23, 15, 0),
});

const meetupUpcoming: Meetup = new Meetup({
  ...meetupOnModeration,
  status: MeetupStatus.CONFIRMED,
  place: 'комн. 601b',
});

const meetupFinished: Meetup = new Meetup({
  ...meetupUpcoming,
});

export const MeetupCard_Topic_NoExcerpt = Template.bind({});

MeetupCard_Topic_NoExcerpt.args = {
  meetup: meetupTopic,
};

export const MeetupCard_Topic_WithExcerpt = Template.bind({});

MeetupCard_Topic_WithExcerpt.args = {
  meetup: meetupTopic,
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
