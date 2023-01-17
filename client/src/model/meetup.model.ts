import { ShortUser } from 'model';

export enum MeetupStatus {
  DRAFT = 'DRAFT',
  REQUEST = 'REQUEST',
  CONFIRMED = 'CONFIRMED',
}

export interface Meetup {
  id: string;
  modified: string; // DateTime string
  start?: string; // DateTime string
  finish?: string; // DateTime string
  author: ShortUser;
  speakers: ShortUser[];
  subject: string;
  excerpt?: string;
  place?: string;
  goCount: number;
  status: MeetupStatus;
  image?: File;
  votedUsers?: ShortUser[];
}

export type NewMeetup = Omit<Meetup, 'id'>;
