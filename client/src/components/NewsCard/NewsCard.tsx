import { Typography, TypographyComponent } from 'components';
import { parseDate } from 'utils';
import { NewsDto } from 'model';

import styles from './NewsCard.module.scss';
import defaultImage from 'assets/images/default-background-blue.jpg';

interface NewsCardProps {
  news: NewsDto;
}

export const NewsCard = ({ news }: NewsCardProps): JSX.Element => {
  const { publicationDate, title, text, imageUrl } = news;

  const { formattedDate } = parseDate(publicationDate, {
    dateOptions: { dateStyle: 'short' },
  });

  return (
    <article className={styles.news}>
      <figure className={styles.image}>
        <img src={imageUrl ?? defaultImage} alt={title} />
      </figure>
      <div className={styles.content}>
        <Typography
          component={TypographyComponent.Paragraph}
          className={styles.date}
        >
          {formattedDate}
        </Typography>
        <Typography
          component={TypographyComponent.Heading2}
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography
          component={TypographyComponent.Paragraph}
          className={styles.text}
        >
          {text}
        </Typography>
      </div>
    </article>
  );
};
