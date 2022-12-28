import { Typography, TypographyComponent } from 'components';
import { parseDateString } from 'helpers';
import { News } from 'model';
import styles from './NewsCard.module.scss';

interface NewsCardProps {
  news: News;
}

export const NewsCard = ({ news }: NewsCardProps): JSX.Element => {
  const { publicationDate, title, text, image } = news;

  const { formattedDate } = parseDateString(publicationDate, {
    dateOptions: { dateStyle: 'short' },
  });

  return (
    <article className={styles.news}>
      <figure className={styles.image}>
        <img src={image} alt={title} />
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
