import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { Typography, TypographyComponent } from 'components';
import { parseDate } from 'utils';
import { News } from 'stores';
import { useLocale } from 'hooks';

import styles from './NewsCard.module.scss';
import defaultImage from 'assets/images/default-background-blue.jpg';

interface NewsCardProps {
  news: News;
}

export const NewsCard = observer(({ news }: NewsCardProps): JSX.Element => {
  const { publicationDate, title, text, image } = news;

  const [locale] = useLocale();
  const { i18n } = useTranslation();

  const { formattedDate } = parseDate(publicationDate, {
    dateOptions: { dateStyle: 'short' },
    locale,
    i18n,
  });

  return (
    <article className={styles.news}>
      <figure className={styles.image}>
        <img src={image?.url ?? defaultImage} alt={title} />
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
});
