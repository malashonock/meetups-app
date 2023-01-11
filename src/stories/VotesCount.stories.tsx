import { ComponentStory, ComponentMeta } from '@storybook/react';
import { VotesCount } from 'components';

export default {
  title: 'Components/VotesCount',
  component: VotesCount,
} as ComponentMeta<typeof VotesCount>;

const Template: ComponentStory<typeof VotesCount> = (args) => (
  <VotesCount {...args} />
);

export const FewVotes = Template.bind({});

FewVotes.args = {
  votesCount: 5,
};

export const ZeroVotes = Template.bind({});

ZeroVotes.args = {
  votesCount: 0,
};

export const ManyVotes = Template.bind({});

ManyVotes.args = {
  votesCount: 100,
};
