export interface News {
  id: string;
  publicationDate: Date;
  title: string;
  text: string;
  image?: File | null;
}

// Data structure exchanged with server
export type NewsDto = Omit<News, 'publicationDate' | 'image'> & {
  publicationDate: string; // Date string
  imageUrl?: string;
};

// Data structure used in create/edit forms
export type NewsFields = Omit<News, 'id' | 'publicationDate'>;
