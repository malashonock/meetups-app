import * as MobX from 'mobx';

import { MeetupStore, RootStore, Meetup, User } from 'stores';
import * as MeetupApi from 'api/services/meetup.service';
import { IMeetup, MeetupStatus, ShortUser } from 'model';
import {
  generateMeetupsData,
  mapMeetupsData,
  mockMeetupData,
  mockMeetupDraftData,
  mockMeetupDraftFilledData,
  mockMeetupFields,
  mockMeetupStore,
  mockTopicData,
} from 'model/__fakes__';

const spiedOnMobXMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');
const spiedOnApiGetMeetups = jest.spyOn(MeetupApi, 'getMeetups');
const spiedOnApiCreateMeetup = jest.spyOn(MeetupApi, 'createMeetup');
const spiedOnApiUpdateMeetup = jest.spyOn(MeetupApi, 'updateMeetup');
const spiedOnApiDeleteMeetup = jest.spyOn(MeetupApi, 'deleteMeetup');

const getIds = <T extends { id: string }>(objects: T[]): string[] =>
  objects.map(({ id }: T): string => id);

const expectMeetupFieldsNotChanged = (meetup1: Meetup, meetup2: Meetup) => {
  expect(meetup1.start).toBe(meetup2.start);
  expect(meetup1.finish).toBe(meetup2.finish);
  expect(meetup1.place).toBe(meetup2.place);
  expect(meetup1.subject).toBe(meetup2.subject);
  expect(meetup1.excerpt).toBe(meetup2.excerpt);
  expect(meetup1.author?.id).toBe(meetup2.author?.id);
  expect(getIds<User>(meetup1.speakers)).toEqual(
    getIds<User>(meetup2.speakers),
  );
  expect(getIds<User>(meetup1.votedUsers)).toEqual(
    getIds<User>(meetup2.votedUsers),
  );
  expect(getIds<User>(meetup1.participants)).toEqual(
    getIds<User>(meetup2.participants),
  );
  expect(meetup1.image).toBe(meetup2.image);
};

const mockMeetupsData: IMeetup[] = generateMeetupsData(1);

beforeEach(() => {
  spiedOnApiGetMeetups.mockReturnValue(Promise.resolve(mockMeetupsData));
  spiedOnApiCreateMeetup.mockReturnValue(Promise.resolve(mockTopicData));
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('MeetupStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const meetupStore = new MeetupStore(new RootStore());
      expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(meetupStore);
    });

    it('should initialize meetups field to an empty array', () => {
      const meetupStore = new MeetupStore(new RootStore());
      expect(meetupStore.meetups.length).toBe(0);
    });
  });

  describe('loadMeetups() instance method', () => {
    it('should call API getMeetups() method', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      await meetupStore.loadMeetups();
      expect(spiedOnApiGetMeetups).toHaveBeenCalled();
    });

    it('should populate meetups field with fetched meetups', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      await meetupStore.loadMeetups();
      expect(meetupStore.meetups.length).toBe(mockMeetupsData.length);
      expect(JSON.stringify(meetupStore.meetups)).toBe(
        JSON.stringify(mapMeetupsData(mockMeetupsData, meetupStore)),
      );
    });
  });

  describe('findMeetup() instance method', () => {
    it('should find meetup by string id', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      await meetupStore.loadMeetups();
      const meetupToFind = meetupStore.meetups[0];
      const foundMeetup = meetupStore.findMeetup(meetupToFind.id);
      expect(JSON.stringify(foundMeetup)).toBe(JSON.stringify(meetupToFind));
    });
  });

  describe('createMeetup() instance method', () => {
    it('should call API createMeetup() method', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      await meetupStore.createMeetup(mockTopicData);
      expect(spiedOnApiCreateMeetup).toHaveBeenCalledWith(mockTopicData);
    });

    it('should append the newly constructed meetup instance to meetups field array', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      const newMeetup = await meetupStore.createMeetup(mockTopicData);
      expect(meetupStore.meetups).toContain(newMeetup);
    });
  });

  describe('onMeetupDeleted() instance method', () => {
    it('should remove the deleted meetup instance from meetups field array', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      const newMeetup = await meetupStore.createMeetup(mockTopicData);
      meetupStore.onMeetupDeleted(newMeetup);
      expect(meetupStore.meetups).not.toContain(newMeetup);
    });
  });
});

describe('Meetup', () => {
  describe('constructor', () => {
    describe('given meetups store is passed', () => {
      it('should make the returned instance observable', () => {
        const meetup = new Meetup(mockMeetupData, mockMeetupStore);
        expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(meetup);
      });
    });

    describe('given meetups store is not passed', () => {
      it('should not make the returned instance observable', () => {
        const meetup = new Meetup(mockMeetupData);
        expect(spiedOnMobXMakeAutoObservable).not.toHaveBeenCalled();
      });
    });

    it('should initialize meetup fields with meetups data', () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      expect(meetup.meetupStore).toBe(mockMeetupStore);
      expect(meetup.id).toBe(mockMeetupData.id);
      expect(meetup.status).toBe(mockMeetupData.status);
      expect(meetup.modified).toBe(mockMeetupData.modified);
      expect(meetup.start).toBe(mockMeetupData.start);
      expect(meetup.finish).toBe(mockMeetupData.finish);
      expect(meetup.place).toBe(mockMeetupData.place);
      expect(meetup.subject).toBe(mockMeetupData.subject);
      expect(meetup.excerpt).toBe(mockMeetupData.excerpt);
      expect(meetup.author?.id).toBe(mockMeetupData.author?.id);
      expect(getIds<User>(meetup.speakers)).toEqual(
        getIds<ShortUser>(mockMeetupData.speakers),
      );
      expect(getIds<User>(meetup.votedUsers)).toEqual(
        getIds<ShortUser>(mockMeetupData.votedUsers),
      );
      expect(getIds<User>(meetup.participants)).toEqual(
        getIds<ShortUser>(mockMeetupData.participants),
      );
      expect(meetup.image).toBe(mockMeetupData.image);
    });
  });

  describe('update() instance method', () => {
    beforeEach(() => {
      spiedOnApiUpdateMeetup.mockReturnValue(
        Promise.resolve(mockMeetupDraftFilledData),
      );
    });

    it('should call API updateMeetup() function', async () => {
      const meetup = new Meetup(mockMeetupDraftData, mockMeetupStore);
      await meetup.update(mockMeetupFields);
      expect(spiedOnApiUpdateMeetup).toHaveBeenCalledWith(
        meetup.id,
        mockMeetupFields,
      );
    });

    it('should update meetups instance fields', async () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      await meetup.update(mockMeetupFields);
      expect(meetup.start).toBe(mockMeetupFields.start);
      expect(meetup.finish).toBe(mockMeetupFields.finish);
      expect(meetup.place).toBe(mockMeetupFields.place);
      expect(meetup.image).toBe(mockMeetupFields.image);
    });
  });

  describe('approve() instance method', () => {
    describe('given a meetup in topic stage', () => {
      it('should set meetup status to DRAFT', async () => {
        spiedOnApiUpdateMeetup.mockReturnValue(
          Promise.resolve(mockMeetupDraftData),
        );
        const meetup = new Meetup(mockTopicData, mockMeetupStore);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;
        await meetup.approve();
        expect(meetup.status).toBe(MeetupStatus.DRAFT);
        expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
      });
    });

    describe('given a meetup after approval', () => {
      it('should not touch meetup status', async () => {
        const meetup = new Meetup(mockMeetupData, mockMeetupStore);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;
        await meetup.approve();
        expect(meetup.status).toBe(meetupSnapshot.status);
        expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
      });
    });
  });

  describe('publish() instance method', () => {
    describe('given a meetup in draft stage', () => {
      describe('given start & finish dates and location are filled', () => {
        it('should set meetup status to CONFIRMED', async () => {
          spiedOnApiUpdateMeetup.mockReturnValue(
            Promise.resolve(mockMeetupData),
          );
          const meetup = new Meetup(mockMeetupDraftFilledData, mockMeetupStore);
          const meetupSnapshot = Object.assign({}, meetup) as Meetup;
          await meetup.publish();
          expect(meetup.status).toBe(MeetupStatus.CONFIRMED);
          expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
        });
      });

      describe('given either start date, or finish date, or location is not filled', () => {
        it('should not touch meetup status', async () => {
          const meetup = new Meetup(mockMeetupDraftData, mockMeetupStore);
          const meetupSnapshot = Object.assign({}, meetup) as Meetup;
          await meetup.publish();
          expect(meetup.status).toBe(meetupSnapshot.status);
          expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
        });
      });
    });

    describe('given a meetup with status other than draft', () => {
      it('should not touch meetup status', async () => {
        const meetup = new Meetup(mockTopicData, mockMeetupStore);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;
        await meetup.publish();
        expect(meetup.status).toBe(meetupSnapshot.status);
        expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
      });
    });
  });

  describe('delete() instance method', () => {
    it('should call API deleteMeetup() function', async () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      await meetup.delete();
      expect(spiedOnApiDeleteMeetup).toHaveBeenCalledWith(meetup.id);
    });

    it('given a meetups store, should call its onMeetupDeleted() method', async () => {
      const spiedOnNewsStoreOnNewsArticleDeleted = jest.spyOn(
        MeetupStore.prototype,
        'onMeetupDeleted',
      );
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      await meetup.delete();
      expect(spiedOnNewsStoreOnNewsArticleDeleted).toHaveBeenCalledWith(meetup);
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize to IMeetup', () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      expect(meetup.toJSON()).toEqual(mockMeetupData);
    });
  });
});
