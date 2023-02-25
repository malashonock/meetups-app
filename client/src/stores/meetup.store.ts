import { makeAutoObservable, runInAction } from 'mobx';

import * as API from 'api';
import { RootStore, User } from 'stores';
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

  async createMeetup(meetupData: MeetupFields): Promise<Meetup> {
    const newMeetupData = await API.createMeetup(meetupData);
    const newMeetup = new Meetup(newMeetupData, this);

    runInAction(() => {
      this.meetups.push(newMeetup);
    });

    return newMeetup;
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
  author: Nullable<User>;
  speakers: User[];
  votedUsers: User[];
  participants: User[];
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
      image: this.image,
    } = meetupData);

    const {
      author: authorData,
      speakers: speakersData,
      votedUsers: votedUsersData,
      participants: participantsData,
    } = meetupData;

    const userStore = this.meetupStore?.rootStore.userStore;

    this.author = userStore?.findUser(authorData) ?? null;
    this.speakers = userStore?.findUsers(speakersData) ?? [];
    this.votedUsers = userStore?.findUsers(votedUsersData) ?? [];
    this.participants = userStore?.findUsers(participantsData) ?? [];
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

  toJSON(): IMeetup {
    return {
      id: this.id,
      status: this.status,
      modified: this.modified,
      start: this.start,
      finish: this.finish,
      place: this.place,
      subject: this.subject,
      excerpt: this.excerpt,
      author: this.author ? this.author.asShortUser() : null,
      speakers: this.speakers.map(
        (speaker: User): ShortUser => speaker.asShortUser(),
      ),
      votedUsers: this.votedUsers.map(
        (votedUser: User): ShortUser => votedUser.asShortUser(),
      ),
      participants: this.participants.map(
        (participant: User): ShortUser => participant.asShortUser(),
      ),
      image: this.image,
    };
  }
}
