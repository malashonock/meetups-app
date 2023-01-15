export interface News {
  id: string;
  publicationDate: string; // Date string
  title: string;
  text: string;
  imageUrl: string | null;
}

export type NewNews = Pick<News, 'title' | 'text'> & {
    image: File | null;
  };