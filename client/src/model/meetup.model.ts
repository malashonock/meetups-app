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

// Data structure exchanged with server
export type MeetupDto = Omit<
  Meetup,
  'modified' | 'start' | 'finish' | 'image'
> & {
  modified: string; // DateTime string
  start?: string; // DateTime string
  finish?: string; // DateTime string
  imageUrl: string | null;
};

// Data structure used in create/edit forms
export type MeetupFields = Omit<Meetup, 'id' | 'author' | 'speakers'> & {
  author: string; // TODO: implement as ShortUser
  speakers: string[]; // TODO implement as ShortUser[]
};
