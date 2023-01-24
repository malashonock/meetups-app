import { ShortUser } from 'model';
import { FileWithUrl, Nullable } from 'types';

export enum MeetupStatus {
  DRAFT = 'DRAFT',
  REQUEST = 'REQUEST',
  CONFIRMED = 'CONFIRMED',
}

export interface IMeetup {
  id: string;
  modified: Date;
  start?: Date;
  finish?: Date;
  author: ShortUser;
  speakers: ShortUser[];
  votedUsers: ShortUser[];
  participants: ShortUser[];
  subject: string;
  excerpt: string;
  place?: string;
  status: MeetupStatus;
  image: Nullable<FileWithUrl>;
}

// Data structures exchanged with server
export interface MeetupDto {
  id: string;
  modified: string; // ISO datetime string
  start?: string; // ISO datetime string
  finish?: string; // ISO datetime string
  author: ShortUser;
  speakers: ShortUser[];
  subject: string;
  excerpt: string;
  place?: string;
  status: MeetupStatus;
  imageUrl: Nullable<string>;
}

// Data structure used in create/edit forms
export type MeetupBody = Omit<
  MeetupDto,
  'id' | 'imageUrl' | 'author' | 'speakers'
> & {
  image: File | Blob | null;
  author: string; // stringified object
  speakers: string; // stringified object array
};

export type MeetupFields = Pick<
  IMeetup,
  'subject' | 'excerpt' | 'start' | 'finish' | 'place' | 'image'
> & {
  author: string; // TODO: replace with ShortUser
};
