import { Nullable, FileWithUrl } from 'types';

export interface INews {
  id: string;
  publicationDate: Date;
  title: string;
  text: string;
  image: Nullable<FileWithUrl>;
}

// Data structure exchanged with server
export interface NewsDto {
  id: string;
  publicationDate: string; // Date string
  title: string;
  text: string;
  imageUrl: Nullable<string>;
}

// Data structure used in create/edit forms
export type NewsFields = Pick<INews, 'title' | 'text' | 'image'>;
