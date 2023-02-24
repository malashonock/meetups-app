import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MeetupCard } from 'components';
import { MeetupDto, MeetupStatus } from 'model';
import { Meetup, User } from 'stores';
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

const author: User = new User({
  id: 'AAA-AAA',
  name: 'Joe',
  surname: 'Jackson',
});

const meetupTopicDto: MeetupDto = {
  id: 'AAA-AAA',
  status: MeetupStatus.REQUEST,
  author,
  subject: 'EF Core от практикующих',
  excerpt:
    'Основные темы, которые буду рассказывать: Database-first (EF Core), Db migrations, Software triggers, DbSet pre-filter (tenant-solution)',
  modified: new Date().toISOString(),
  speakers: [],
  votedUsers: [],
  participants: [],
  imageUrl: null,
};

const meetupDraftNoDateDto: MeetupDto = {
  ...meetupTopicDto,
  status: MeetupStatus.DRAFT,
};

const meetupDraftDto: MeetupDto = {
  ...meetupDraftNoDateDto,
  start: new Date(2022, 3, 23, 15, 0).toISOString(),
};

const meetupUpcomingDto: MeetupDto = {
  ...meetupDraftDto,
  status: MeetupStatus.CONFIRMED,
  place: 'комн. 601b',
};

const meetupTopic: Meetup = new Meetup(meetupTopicDto);
const meetupDraftNoDate: Meetup = new Meetup(meetupDraftNoDateDto);
const meetupDraft: Meetup = new Meetup(meetupDraftDto);
const meetupConfirmed: Meetup = new Meetup(meetupUpcomingDto);

export const MeetupCard_Topic_NoExcerpt = Template.bind({});
MeetupCard_Topic_NoExcerpt.args = {
  meetup: meetupTopic,
};

export const MeetupCard_Topic_WithExcerpt = Template.bind({});
MeetupCard_Topic_WithExcerpt.args = {
  meetup: meetupTopic,
};

export const MeetupCard_DraftNoDate = Template.bind({});
MeetupCard_DraftNoDate.args = {
  meetup: meetupDraftNoDate,
};

export const MeetupCard_Draft = Template.bind({});
MeetupCard_Draft.args = {
  meetup: meetupDraft,
};

export const MeetupCard_Confirmed = Template.bind({});
MeetupCard_Confirmed.args = {
  meetup: meetupConfirmed,
};
