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
  excerpt: string;
  place?: string;
  goCount: number;
  status: MeetupStatus;
  imageUrl: string | null;
  votedUsers?: ShortUser[];
}

export type NewMeetup = Omit<Meetup,
  | 'id'
  | 'modified'
  | 'start'
  | 'finish'
  | 'imageUrl'
  | 'author'
  | 'speakers'
> & {
  modified: Date | null;
  start: Date | null;
  finish: Date | null;
  image: File | null;
  author: string; // TODO: implement as ShortUser
  speakers: string[]; // TODO implement as ShortUser[]
};
