import { ShortUser } from 'model';

export enum MeetupStatus {
  DRAFT = 'DRAFT',
  REQUEST = 'REQUEST',
  CONFIRMED = 'CONFIRMED',
}

export interface Meetup {
  id: string;
  modified: Date;
  start?: Date;
  finish?: Date;
  author: ShortUser;
  speakers: ShortUser[];
  subject: string;
  excerpt: string;
  place?: string;
  goCount: number;
  status: MeetupStatus;
  image?: File | null;
  votedUsers?: ShortUser[];
}

// Data structures exchanged with server
export type MeetupDto = Omit<
  Meetup,
  'modified' | 'start' | 'finish' | 'image'
> & {
  modified: string; // DateTime string
  start?: string; // DateTime string
  finish?: string; // DateTime string
  imageUrl: string | null;
};

export type MeetupFormData = Omit<Meetup, 'id'>;

// Data structure used in create/edit forms
export type MeetupFields = Pick<
  Meetup,
  'subject' | 'excerpt' | 'start' | 'finish' | 'place' | 'image'
> & {
  author: string; // TODO: implement as ShortUser
};
