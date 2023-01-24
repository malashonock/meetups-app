import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NewsCard } from 'components';
import { News } from 'stores';
import { getFileWithUrl } from 'utils';
import testImage from './assets/news-img.jpg';

export default {
  title: 'Components/NewsCard',
  component: NewsCard,
} as ComponentMeta<typeof NewsCard>;

const Template: ComponentStory<typeof NewsCard> = (args) => (
  <div
    style={{
      width: '100%',
      maxWidth: '550px',
      margin: '0 auto',
    }}
  >
    <NewsCard {...args} />
  </div>
);

const newsArticle: News = new News({
  id: 'AAA-AAA',
  publicationDate: new Date(),
  title: 'Our Vilnius office celebrates 1 year!',
  text:
    '🙌 The SaM Solutions office in #Vilnius celebrates a one-year anniversary.' +
    ' 🎉 Congratulations to our colleagues! Keep it up! More new victories and achievements ahead. 💪 #SaMSolutions',
  image: getFileWithUrl(new File(['testImage'], 'news-img.jpg'), testImage),
});

export const Default = Template.bind({});

Default.args = {
  news: newsArticle,
};
