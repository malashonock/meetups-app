export interface News {
  id: string;
  publicationDate: string; // Date string
  title: string;
  text: string;
  imageUrl: string;
}

export type NewNews = Omit<News, 
  | 'id'
  | 'publicationDate'
  | 'imageUrl'
> & {
  image: File | null;
} ;
