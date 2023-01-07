export interface News {
  id: string;
  publicationDate: string; // Date string
  title: string;
  text: string;
  image: string;
}

export type NewNews = Omit<News, 'id' | 'publicationDate'>;
