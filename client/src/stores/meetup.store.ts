import { makeAutoObservable, runInAction } from 'mobx';

import * as API from 'api';
import { RootStore, User } from 'stores';
import { FileWithUrl, ILoadable, Nullable, Optional } from 'types';
import { IMeetup, MeetupFields, MeetupStatus } from 'model';
import { isPast } from 'utils';

export class MeetupStore implements ILoadable {
  rootStore: RootStore;
  meetups: Meetup[];
  isInitialized: boolean;

  isLoading: boolean;
  isError: boolean;
  errors: unknown[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    this.meetups = [];
    this.isInitialized = false;

    this.isLoading = false;
    this.isError = false;
    this.errors = [];
  }

  async loadMeetups(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.isLoading = true;

      const meetupsData: IMeetup[] = await API.getMeetups();
      runInAction(() => {
        this.meetups = meetupsData.map(
          (meetupData: IMeetup): Meetup => new Meetup(meetupData, this),
        );

        this.isInitialized = true;

        this.isLoading = false;
        this.isError = false;
        this.errors.length = 0;
      });
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  async createMeetup(meetupData: MeetupFields): Promise<Optional<Meetup>> {
    try {
      this.isLoading = true;

      const newMeetupData = await API.createMeetup(meetupData);
      const newMeetup = new Meetup(newMeetupData, this);

      this.meetups.push(newMeetup);

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;

      return newMeetup;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  onMeetupDeleted(deletedMeetup: Meetup): void {
    this.meetups.splice(this.meetups.indexOf(deletedMeetup), 1);
  }

  findMeetup(id: string): Optional<Meetup> {
    return this.meetups.find((meetup: Meetup) => meetup.id === id);
  }

  toJSON() {
    return {
      meetups: this.meetups,
    };
  }
}

export class Meetup implements IMeetup, ILoadable {
  meetupStore: Nullable<MeetupStore> = null;
  isInitialized: boolean;
  isLoading: boolean;
  isError: boolean;
  errors: unknown[];

  id: string;
  status: MeetupStatus;
  modified: Date;
  start?: Date;
  finish?: Date;
  place?: string;
  subject: string;
  excerpt: string;
  author: User;
  speakers: User[];
  votedUsers: User[];
  participants: User[];
  imageUrl: Nullable<string>;
  image: Nullable<FileWithUrl> = null;

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
      imageUrl: this.imageUrl,
    } = meetupData);

    const {
      author: authorData,
      speakers: speakersData,
      votedUsers: votedUsersData,
      participants: participantsData,
    } = meetupData;

    this.author = new User(authorData);
    this.speakers = speakersData.map(User.factory);
    this.votedUsers = votedUsersData.map(User.factory);
    this.participants = participantsData.map(User.factory);

    this.isInitialized = false;
    this.isLoading = false;
    this.isError = false;
    this.errors = [];
  }

  async init(): Promise<Meetup> {
    this.isInitialized = false;

    if (!this.imageUrl) {
      this.isInitialized = true;
      return this;
    }

    try {
      this.isLoading = true;

      const image = await API.getStaticFile(this.imageUrl);
      runInAction(() => {
        this.image = image;
        this.isInitialized = true;

        this.isLoading = false;
        this.isError = false;
        this.errors.length = 0;
      });
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    } finally {
      return this;
    }
  }

  async update(meetupData: Partial<MeetupFields>): Promise<void> {
    try {
      this.isLoading = true;

      const updatedMeetupData = await API.updateMeetup(this.id, meetupData);
      runInAction(async () => {
        Object.assign(this, new Meetup(updatedMeetupData));
        await this.init();
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  async approve(): Promise<void> {
    if (this.status !== MeetupStatus.REQUEST) {
      return;
    }

    try {
      this.isLoading = true;

      const updatedMeetupData = await API.updateMeetup(
        this.id,
        {},
        MeetupStatus.DRAFT,
      );
      runInAction(() => {
        Object.assign(this, new Meetup(updatedMeetupData));
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  async publish(): Promise<void> {
    if (this.status !== MeetupStatus.DRAFT) {
      return;
    }

    if (!this.start || !this.finish || !this.place) {
      return;
    }

    try {
      this.isLoading = true;

      const updatedMeetupData = await API.updateMeetup(
        this.id,
        {},
        MeetupStatus.CONFIRMED,
      );
      runInAction(() => {
        Object.assign(this, new Meetup(updatedMeetupData));
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  get canLoggedUserSupport(): boolean {
    const loggedUser = this.meetupStore?.rootStore.authStore.loggedUser;
    if (
      loggedUser &&
      loggedUser.id !== this.author.id &&
      this.speakers.findIndex(
        (speaker: User): boolean => speaker.id === loggedUser.id,
      ) === -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  get hasLoggedUserVoted(): boolean {
    const loggedUser = this.meetupStore?.rootStore.authStore.loggedUser;
    if (!loggedUser) {
      return false;
    }

    return (
      this.votedUsers.findIndex(
        (votedUser: User): boolean => votedUser.id === loggedUser.id,
      ) > -1
    );
  }

  async vote(): Promise<void> {
    if (this.status !== MeetupStatus.REQUEST) {
      return;
    }

    const loggedUser = this.meetupStore?.rootStore.authStore.loggedUser;
    if (!loggedUser || !this.canLoggedUserSupport) {
      return;
    }

    try {
      this.isLoading = true;

      await API.voteForMeetup(this.id);
      runInAction(() => {
        this.votedUsers.unshift(new User(loggedUser));
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  async withdrawVote(): Promise<void> {
    if (this.status !== MeetupStatus.REQUEST) {
      return;
    }

    const loggedUser = this.meetupStore?.rootStore.authStore.loggedUser;
    if (!loggedUser) {
      return;
    }

    try {
      this.isLoading = true;

      await API.withdrawVoteForMeetup(this.id);
      runInAction(() => {
        this.votedUsers = this.votedUsers.filter(
          (votedUser: User): boolean => votedUser.id !== loggedUser.id,
        );
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  get hasLoggedUserJoined(): boolean {
    const loggedUser = this.meetupStore?.rootStore.authStore.loggedUser;
    if (!loggedUser) {
      return false;
    }

    return (
      this.participants.findIndex(
        (participant: User): boolean => participant.id === loggedUser.id,
      ) > -1
    );
  }

  async join(): Promise<void> {
    if (
      this.status !== MeetupStatus.CONFIRMED &&
      (!this.start || (this.start && !isPast(this.start)))
    ) {
      return;
    }

    const loggedUser = this.meetupStore?.rootStore.authStore.loggedUser;
    if (!loggedUser || !this.canLoggedUserSupport) {
      return;
    }

    try {
      this.isLoading = true;

      await API.joinMeetup(this.id);
      runInAction(() => {
        this.participants.unshift(new User(loggedUser));
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  async cancelJoin(): Promise<void> {
    if (
      this.status !== MeetupStatus.CONFIRMED &&
      (!this.start || (this.start && !isPast(this.start)))
    ) {
      return;
    }

    const loggedUser = this.meetupStore?.rootStore.authStore.loggedUser;
    if (!loggedUser) {
      return;
    }

    try {
      this.isLoading = true;

      await API.cancelJoinMeetup(this.id);
      runInAction(() => {
        this.participants = this.participants.filter(
          (participant: User): boolean => participant.id !== loggedUser.id,
        );
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  async delete(): Promise<void> {
    try {
      this.isLoading = true;

      await API.deleteMeetup(this.id);
      runInAction(() => {
        this.meetupStore?.onMeetupDeleted(this);
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
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
      author: this.author?.toJSON() ?? null,
      speakers: this.speakers.map(User.serialize),
      votedUsers: this.votedUsers.map(User.serialize),
      participants: this.participants.map(User.serialize),
      imageUrl: this.imageUrl,
    };
  }
}
