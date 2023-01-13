import { httpClient } from 'helpers';
import { NewNews, News } from 'model';

export const getNews = async (): Promise<News[]> => {
  const { data: articles } = await httpClient.get<News[]>('/news');
  return articles;
};

export const getNewsArticle = async (id: string): Promise<News> => {
  const { data: article } = await httpClient.get<News>(`/news/${id}`);
  return article;
};

export const createNewsArticle = async (
  newArticleData: NewNews,
): Promise<News> => {
  const formData = new FormData();

  Object.entries(formData).forEach(([name, value]) => formData.append(name, value));

  const { data: createdArticle } = await httpClient.post<News>('/news', {
    data: formData,
  }, {
    headers: {
      'Content-Type': 'muiltipart/form-data',
    },
  });
  return createdArticle;
};

export const updateNewsArticle = async (
  updatedArticleData: News,
): Promise<News> => {
  const { data: updatedArticle } = await httpClient.put<News>('/news', {
    data: updatedArticleData,
  });
  return updatedArticle;
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  await httpClient.delete(`/news/${id}`);
};
