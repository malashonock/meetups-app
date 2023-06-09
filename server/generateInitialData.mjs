import {fixedUsers, generateUsers} from './data/users.mjs';
import {fixedMeetups, generateMeetups, generateShortUsers} from './data/meetups.mjs';
import {fixedNews, generateNews} from './data/news.mjs';

export const generateInitialData = async () => {
  const users = [...fixedUsers, ...generateUsers(100)];
  const meetups = [...fixedMeetups, ...(await generateMeetups(20, users))];
  const participants = generateShortUsers(meetups, users);
  const votedUsers = generateShortUsers(meetups, users);
  const news = [...fixedNews, ...(await generateNews(10))]
  return { users, meetups, participants, votedUsers, news };
};
