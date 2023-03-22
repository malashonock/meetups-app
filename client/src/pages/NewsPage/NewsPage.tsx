import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonVariant,
  LoadingSpinner,
  NewsCard,
  Typography,
  TypographyComponent,
} from 'components';
import { NotFoundPage } from 'pages';
import { useNewsStore } from 'hooks';
import { News } from 'stores';

import styles from './NewsPage.module.scss';

export const NewsPage = observer(() => {
  const { news, isLoading, isError } = useNewsStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!news || isError) {
    return <NotFoundPage />;
  }

  const handleCreateNews = () => navigate('/news/create');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography
          component={TypographyComponent.Heading1}
          className={styles.heading}
        >
          {t('news')}
        </Typography>
        <Button
          id="btn-create-news"
          variant={ButtonVariant.Secondary}
          onClick={handleCreateNews}
          className={styles.createNewsBtn}
        >
          {t('newsPage.createNewsBtn')}
        </Button>
      </div>
      {isLoading ? (
        <LoadingSpinner text={t('loadingText.news')} />
      ) : (
        <ul className={styles.newsList}>
          {news?.map((article: News) => (
            <li key={article.id} className={styles.newsItem}>
              <NavLink to={`/news/${article.id}`}>
                <NewsCard news={article} />
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
