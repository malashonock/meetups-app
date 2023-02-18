import { getStaticFile, httpClient } from 'api';
import { NewsFields, NewsDto, INews } from 'model';

export const getNews = async (): Promise<INews[]> => {
  const { data: articlesData } = await httpClient.get<NewsDto[]>('/news');
  return Promise.all(articlesData.map(getNewsFromJson));
};

export const getNewsArticle = async (id: string): Promise<INews> => {
  const { data: articleData } = await httpClient.get<NewsDto>(`/news/${id}`);
  return getNewsFromJson(articleData);
};

export const createNewsArticle = async (
  newArticleFields: NewsFields,
): Promise<INews> => {
  const formData = buildNewsFormData(newArticleFields);

  const { data: createdArticleData } = await httpClient.post<NewsDto>(
    '/news',
    formData,
  );

  return getNewsFromJson(createdArticleData);
};

export const updateNewsArticle = async (
  id: string,
  updatedArticleFields: Partial<NewsFields>,
): Promise<INews> => {
  const formData = buildNewsFormData(updatedArticleFields);

  const { data: updatedArticleData } = await httpClient.patch<NewsDto>(
    `/news/${id}`,
    formData,
  );

  return getNewsFromJson(updatedArticleData);
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  await httpClient.delete(`/news/${id}`);
};

export const getNewsFromJson = async (articleData: NewsDto): Promise<INews> => {
  const { id, publicationDate, title, text, imageUrl } = articleData;

  const image = imageUrl ? await getStaticFile(imageUrl) : null;

  return {
    id,
    publicationDate: new Date(publicationDate),
    title,
    text,
    image,
  };
};

export const buildNewsFormData = (
  newsFields: Partial<NewsFields>,
): FormData => {
  const formData = new FormData();

  Object.entries(newsFields).forEach(([name, value]): void => {
    if (value !== null && value !== undefined) {
      formData.append(name, value);
    }
  });

  return formData;
};
