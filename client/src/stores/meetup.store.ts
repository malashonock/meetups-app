import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import * as API from 'api';
import { FullUser, RootStore, User } from 'stores';
import {
  AlertSeverity,
  FileWithUrl,
  Loadable,
  LoadError,
  Maybe,
  Nullable,
  Optional,
} from 'types';
import { IMeetup, MeetupFields, MeetupStatus } from 'model';
import { isPast } from 'utils';

export class MeetupStore extends Loadable {
  rootStore: RootStore;
  meetups: Meetup[];
  isInitialized: boolean;

  constructor(rootStore: RootStore) {
    super();

    this.rootStore = rootStore;
    this.setupObservable();

    this.meetups = [];
    this.isInitialized = false;

    this.onLoadError = (error: LoadError): void => {
      const { code, message } = error;
      this.rootStore.onAlert({
        severity: AlertSeverity.Error,
        title: 'Server Error',
        text: `Error ${code}: ${message}`,
      });
    };
  }

  setupObservable(): void {
    makeObservable(this, {
      rootStore: observable,
      meetups: observable,
      isInitialized: observable,
      loadMeetups: action,
      createMeetup: action,
      onMeetupDeleted: action,
    });
  }

  async loadMeetups(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    await this.tryLoad(async () => {
      const meetupsData: IMeetup[] = await API.getMeetups();
      runInAction(() => {
        this.meetups = meetupsData.map(
          (meetupData: IMeetup): Meetup => new Meetup(meetupData, this),
        );

        this.isInitialized = true;
      });
    });
  }

  async createMeetup(meetupData: MeetupFields): Promise<Optional<Meetup>> {
    return await this.tryLoad(async () => {
      const newMeetupData = await API.createMeetup(meetupData);
      const newMeetup = new Meetup(newMeetupData, this);

      this.meetups.push(newMeetup);

      return newMeetup;
    });
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

export class Meetup extends Loadable implements IMeetup {
  meetupStore: Nullable<MeetupStore> = null;
  isInitialized: boolean;

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
    super();
    this.setupObservable();

    if (meetupStore) {
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

    this.onLoadError = (error: LoadError): void => {
      if (this.meetupStore?.onLoadError) {
        this.meetupStore.onLoadError(error);
      }
    };
  }

  setupObservable(): void {
    makeObservable(this, {
      meetupStore: observable,
      isInitialized: observable,
      id: observable,
      status: observable,
      modified: observable,
      start: observable,
      finish: observable,
      place: observable,
      subject: observable,
      excerpt: observable,
      author: observable,
      speakers: observable,
      votedUsers: observable,
      participants: observable,
      imageUrl: observable,
      image: observable,
      init: action,
      update: action,
      approve: action,
      publish: action,
      actor: computed,
      canLoggedUserSupport: computed,
      hasLoggedUserVoted: computed,
      vote: action,
      withdrawVote: action,
      hasLoggedUserJoined: computed,
      join: action,
      cancelJoin: action,
      delete: action,
    });
  }

  async init(): Promise<Meetup> {
    this.isInitialized = false;

    if (!this.imageUrl) {
      this.isInitialized = true;
      return this;
    }

    await this.tryLoad(async () => {
      const image = await API.getStaticFile(this.imageUrl!);
      runInAction(() => {
        this.image = image;
        this.isInitialized = true;
      });
    });

    return this;
  }

  async update(meetupData: Partial<MeetupFields>): Promise<void> {
    await this.tryLoad(async () => {
      const updatedMeetupData = await API.updateMeetup(this.id, meetupData);
      runInAction(async () => {
        Object.assign(this, new Meetup(updatedMeetupData));
        await this.init();
      });
    });
  }

  async approve(): Promise<void> {
    if (this.status !== MeetupStatus.REQUEST) {
      return;
    }

    await this.tryLoad(async () => {
      const updatedMeetupData = await API.updateMeetup(
        this.id,
        {},
        MeetupStatus.DRAFT,
      );
      runInAction(() => {
        Object.assign(this, new Meetup(updatedMeetupData));
      });
    });
  }

  async publish(): Promise<void> {
    if (this.status !== MeetupStatus.DRAFT) {
      return;
    }

    if (!this.start || !this.finish || !this.place) {
      return;
    }

    await this.tryLoad(async () => {
      const updatedMeetupData = await API.updateMeetup(
        this.id,
        {},
        MeetupStatus.CONFIRMED,
      );
      runInAction(() => {
        Object.assign(this, new Meetup(updatedMeetupData));
      });
    });
  }

  get actor(): Maybe<FullUser> {
    return this.meetupStore?.rootStore.authStore.loggedUser;
  }

  get canLoggedUserSupport(): boolean {
    if (
      this.actor &&
      this.actor.id !== this.author.id &&
      this.speakers.findIndex(
        (speaker: User): boolean => speaker.id === this.actor!.id,
      ) === -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  get hasLoggedUserVoted(): boolean {
    if (!this.actor) {
      return false;
    }

    return (
      this.votedUsers.findIndex(
        (votedUser: User): boolean => votedUser.id === this.actor!.id,
      ) > -1
    );
  }

  async vote(): Promise<void> {
    if (this.status !== MeetupStatus.REQUEST) {
      return;
    }

    if (!this.actor || !this.canLoggedUserSupport) {
      return;
    }

    await this.tryLoad(async () => {
      await API.voteForMeetup(this.id);
      runInAction(() => {
        this.votedUsers.unshift(new User(this.actor!));
      });
    });
  }

  async withdrawVote(): Promise<void> {
    if (this.status !== MeetupStatus.REQUEST) {
      return;
    }

    if (!this.actor) {
      return;
    }

    await this.tryLoad(async () => {
      await API.withdrawVoteForMeetup(this.id);
      runInAction(() => {
        this.votedUsers = this.votedUsers.filter(
          (votedUser: User): boolean => votedUser.id !== this.actor!.id,
        );
      });
    });
  }

  get hasLoggedUserJoined(): boolean {
    if (!this.actor) {
      return false;
    }

    return (
      this.participants.findIndex(
        (participant: User): boolean => participant.id === this.actor!.id,
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

    if (!this.actor || !this.canLoggedUserSupport) {
      return;
    }

    await this.tryLoad(async () => {
      await API.joinMeetup(this.id);
      runInAction(() => {
        this.participants.unshift(new User(this.actor!));
      });
    });
  }

  async cancelJoin(): Promise<void> {
    if (
      this.status !== MeetupStatus.CONFIRMED &&
      (!this.start || (this.start && !isPast(this.start)))
    ) {
      return;
    }

    if (!this.actor) {
      return;
    }

    await this.tryLoad(async () => {
      await API.cancelJoinMeetup(this.id);
      runInAction(() => {
        this.participants = this.participants.filter(
          (participant: User): boolean => participant.id !== this.actor!.id,
        );
      });
    });
  }

  async delete(): Promise<void> {
    await this.tryLoad(async () => {
      await API.deleteMeetup(this.id);
      runInAction(() => {
        this.meetupStore?.onMeetupDeleted(this);
      });
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
      author: this.author?.toJSON() ?? null,
      speakers: this.speakers.map(User.serialize),
      votedUsers: this.votedUsers.map(User.serialize),
      participants: this.participants.map(User.serialize),
      imageUrl: this.imageUrl,
    };
  }
}
