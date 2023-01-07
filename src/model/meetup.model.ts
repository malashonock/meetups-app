import { ShortUser } from 'model';

export enum MeetupStatus {
  REQUEST = 'request',
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
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
  isOver: boolean;
  image?: File;
}

export type NewMeetup = Omit<Meetup, 'id'>;
