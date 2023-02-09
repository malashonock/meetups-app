import { getNews } from 'api';
import {
  Button,
  ButtonVariant,
  NewsCard,
  Typography,
  TypographyComponent,
} from 'components';
import { NewsDto } from 'model';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './NewsPage.module.scss';

export const NewsPage = () => {
  const [news, setNews] = useState<NewsDto[]>([]);

  const navigate = useNavigate();

  const openCreateNewsPage = () => navigate('/news/create');

  useEffect(() => {
    const fetchNews = async () => setNews(await getNews());
    fetchNews();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography
          component={TypographyComponent.Heading1}
          className={styles.heading}
        >
          Новости
        </Typography>
        <Button variant={ButtonVariant.Secondary} onClick={openCreateNewsPage}>
          + Создать новость
        </Button>
      </div>
      <ul className={styles.newsList}>
        {news.map((article: NewsDto) => (
          <li key={article.id} className={styles.newsItem}>
            <NavLink to={`/news/${article.id}`}>
              <NewsCard news={article} />
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
