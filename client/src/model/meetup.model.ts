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
  author: Nullable<ShortUser>;
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
export type MeetupFields = Pick<
  IMeetup,
  'subject' | 'excerpt' | 'author' | 'start' | 'finish' | 'place' | 'image'
>;
