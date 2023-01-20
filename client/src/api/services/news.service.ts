import { httpClient } from 'api';
import { NewsFields, NewsDto } from 'model';

export const getNews = async (): Promise<NewsDto[]> => {
  const { data: articles } = await httpClient.get<NewsDto[]>('/news');
  return articles;
};

export const getNewsArticle = async (id: string): Promise<NewsDto> => {
  const { data: article } = await httpClient.get<NewsDto>(`/news/${id}`);
  return article;
};

export const createNewsArticle = async (
  newArticleData: NewsFields,
): Promise<NewsDto> => {
  const formData = new FormData();

  Object.entries(newArticleData).forEach(([name, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(name, value);
    }
  });

  const { data: createdArticle } = await httpClient.post<NewsDto>(
    '/news',
    formData,
  );
  return createdArticle;
};

export const updateNewsArticle = async (
  id: string,
  updatedArticleData: NewsFields,
): Promise<NewsDto> => {
  const formData = new FormData();

  Object.entries(updatedArticleData).forEach(([name, value]) => {
    if (value !== null) {
      formData.append(name, value);
    }
  });

  const { data: updatedArticle } = await httpClient.put<NewsDto>(
    `/news/${id}`,
    formData,
  );
  return updatedArticle;
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  await httpClient.delete(`/news/${id}`);
};
