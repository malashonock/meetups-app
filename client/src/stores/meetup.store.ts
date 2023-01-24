import { makeAutoObservable, runInAction } from 'mobx';

import * as API from 'api';
import { RootStore } from 'stores';
import { FileWithUrl, Nullable, Optional } from 'types';
import { IMeetup, MeetupFields, MeetupStatus, ShortUser } from 'model';

export class MeetupStore {
  meetups: Meetup[];

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);
    this.meetups = [];
  }

  async loadMeetups(): Promise<void> {
    const meetupsData: IMeetup[] = await API.getMeetups();
    runInAction(() => {
      this.meetups = meetupsData.map(
        (meetupData: IMeetup): Meetup => new Meetup(meetupData, this),
      );
    });
  }

  async createMeetup(meetupData: MeetupFields): Promise<void> {
    const newMeetupData = await API.createMeetup(meetupData);
    runInAction(() => {
      this.meetups.push(new Meetup(newMeetupData, this));
    });
  }

  onMeetupDeleted(deletedMeetup: Meetup): void {
    this.meetups.splice(this.meetups.indexOf(deletedMeetup), 1);
  }

  findMeetup(id: string): Optional<Meetup> {
    return this.meetups.find((meetup: Meetup) => meetup.id === id);
  }
}

export class Meetup implements IMeetup {
  meetupStore: Nullable<MeetupStore> = null;

  id: string;
  status: MeetupStatus;
  modified: Date;
  start?: Date;
  finish?: Date;
  place?: string;
  subject: string;
  excerpt: string;
  author: ShortUser;
  speakers: ShortUser[];
  votedUsers: ShortUser[];
  participants: ShortUser[];
  image: Nullable<FileWithUrl>;

  constructor(meetupData: IMeetup, meetupStore?: MeetupStore) {
    if (meetupStore) {
      makeAutoObservable(this);
      this.meetupStore = meetupStore;
    }

    ({
      id: this.id,
      status: this.status,
      modified: this.modified,
      start: this.start,
      finish: this.finish,
      place: this.place,
      subject: this.subject,
      excerpt: this.excerpt,
      author: this.author,
      speakers: this.speakers,
      votedUsers: this.votedUsers,
      participants: this.participants,
      image: this.image,
    } = meetupData);
  }

  async update(meetupData: Partial<MeetupFields>): Promise<void> {
    const updatedMeetupData = await API.updateMeetup(this.id, meetupData);
    runInAction(() => {
      Object.assign(this, updatedMeetupData);
    });
  }

  async approve(): Promise<void> {
    if (this.status !== MeetupStatus.REQUEST) {
      return;
    }

    const updatedMeetupData = await API.updateMeetup(
      this.id,
      {},
      MeetupStatus.DRAFT,
    );
    runInAction(() => {
      Object.assign(this, updatedMeetupData);
    });
  }

  async publish(): Promise<void> {
    if (this.status !== MeetupStatus.DRAFT) {
      return;
    }

    if (!this.start || !this.finish || !this.place) {
      return;
    }

    const updatedMeetupData = await API.updateMeetup(
      this.id,
      {},
      MeetupStatus.CONFIRMED,
    );
    runInAction(() => {
      Object.assign(this, updatedMeetupData);
    });
  }

  async delete(): Promise<void> {
    await API.deleteMeetup(this.id);
    runInAction(() => {
      this.meetupStore?.onMeetupDeleted(this);
    });
  }
}
