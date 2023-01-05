import { httpClient } from 'helpers';
import { NewNews, News } from 'model';

export const getNews = async (): Promise<News[]> => {
  return await httpClient.get('/news');
};

export const getNewsArticle = async (id: string): Promise<News> => {
  return await httpClient.get(`/news/${id}`);
};

export const createNewsArticle = async (
  newArticleData: NewNews,
): Promise<News> => {
  const createdArticle: News = await httpClient.post('/news', {
    data: newArticleData,
  });
  return createdArticle;
};

export const updateNewsArticle = async (
  updatedArticleData: News,
): Promise<News> => {
  const updatedArticle: News = await httpClient.put('/news', {
    data: updatedArticleData,
  });
  return updatedArticle;
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  await httpClient.delete(`/news/${id}`);
};
