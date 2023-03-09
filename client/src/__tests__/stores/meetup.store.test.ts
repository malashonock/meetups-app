import * as MobX from 'mobx';
import { faker } from '@faker-js/faker';

import { MeetupStore, RootStore, Meetup, User } from 'stores';
import * as MeetupApi from 'api/services/meetup.service';
import * as FileApi from 'api/services/static.service';
import { MeetupStatus, IUser, IMeetup, AppError } from 'model';
import {
  generateMeetupsData,
  mapMeetupsData,
  mockMeetupDraftData,
  mockMeetupDraftFilledData,
  mockMeetupData,
  mockMeetupFields,
  mockMeetupStore,
  mockTopicData,
  mockTopicFields,
  mockFullUser,
  mockUserData,
  mockUser2Data,
  mockFullUser2,
  mockUser2,
  mockUser,
  mockImageWithUrl,
} from 'model/__fakes__';
import { AlertSeverity } from 'types';

const spiedOnMobXMakeObservable = jest.spyOn(MobX, 'makeObservable');
const spiedOnApiGetMeetups = jest.spyOn(MeetupApi, 'getMeetups');
const spiedOnApiCreateMeetup = jest.spyOn(MeetupApi, 'createMeetup');
const spiedOnApiUpdateMeetup = jest.spyOn(MeetupApi, 'updateMeetup');
const spiedOnApiDeleteMeetup = jest.spyOn(MeetupApi, 'deleteMeetup');
const spiedOnApiVoteForMeetup = jest.spyOn(MeetupApi, 'voteForMeetup');
const spiedOnApiWithdrawVoteForMeetup = jest.spyOn(
  MeetupApi,
  'withdrawVoteForMeetup',
);
const spiedOnApiJoinMeetup = jest.spyOn(MeetupApi, 'joinMeetup');
const spiedOnApiCancelJoinMeetup = jest.spyOn(MeetupApi, 'cancelJoinMeetup');
const spiedOnGetStaticFile = jest.spyOn(FileApi, 'getStaticFile');

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

const mockMeetupsData: IMeetup[] = generateMeetupsData(20);

const ERROR_CODE = '500';
const ERROR_PROBLEM = 'Internal server error';
const ERROR_HINT = 'File a ticket to tech support';
const appError = new AppError(ERROR_CODE, ERROR_PROBLEM, ERROR_HINT);

beforeEach(() => {
  spiedOnApiGetMeetups.mockResolvedValue(mockMeetupsData);
  spiedOnApiCreateMeetup.mockResolvedValue(mockTopicData);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('MeetupStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const meetupStore = new MeetupStore(new RootStore());
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
      const meetupStore = new MeetupStore(new RootStore());

      expect(meetupStore.meetups.length).toBe(0);
      expect(meetupStore.isInitialized).toBe(false);
      expect(meetupStore.onError).toBeTruthy();
    });
  });

  describe('loadMeetups() instance method', () => {
    describe('given isInitialized is false', () => {
      it('should call API getMeetups() method', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        await meetupStore.loadMeetups();
        expect(spiedOnApiGetMeetups).toHaveBeenCalled();
      });

      describe('given API request resolves successfully', () => {
        it('should populate meetups field with fetched meetups', async () => {
          const meetupStore = new MeetupStore(new RootStore());
          await meetupStore.loadMeetups();

          expect(meetupStore.meetups.length).toBe(mockMeetupsData.length);
          expect(JSON.stringify(meetupStore.meetups)).toBe(
            JSON.stringify(mapMeetupsData(mockMeetupsData, meetupStore)),
          );
        });

        it('should set isInitialized field to true', async () => {
          const meetupStore = new MeetupStore(new RootStore());
          await meetupStore.loadMeetups();

          expect(meetupStore.isInitialized).toBe(true);
        });
      });

      describe('given API request rejects with an error', () => {
        beforeEach(() => {
          spiedOnApiGetMeetups.mockRejectedValue(appError);
        });

        it('should not add any elements to the meetups array', async () => {
          const meetupStore = new MeetupStore(new RootStore());
          await meetupStore.loadMeetups();
          expect(meetupStore.meetups.length).toBe(0);
        });

        it('should leave isInitialized field false', async () => {
          const meetupStore = new MeetupStore(new RootStore());
          await meetupStore.loadMeetups();
          expect(meetupStore.isInitialized).toBe(false);
        });

        it('should push an error alert up to the root store', async () => {
          const rootStore = new RootStore();
          const spiedOnRootStoreOnAlert = jest.fn();
          rootStore.onAlert = spiedOnRootStoreOnAlert;
          const meetupStore = new MeetupStore(rootStore);

          await meetupStore.loadMeetups();

          expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
          expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
            AlertSeverity.Error,
          );
        });
      });
    });

    describe('given isInitialized is true', () => {
      it('should not call API getMeetups() method', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        meetupStore.isInitialized = true;

        await meetupStore.loadMeetups();

        expect(spiedOnApiGetMeetups).not.toHaveBeenCalled();
      });

      it('should leave the meetups field untouched', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        meetupStore.isInitialized = true;
        await meetupStore.loadMeetups();
        expect(meetupStore.meetups.length).toBe(0);
      });

      it('should leave isInitialized field true', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        meetupStore.isInitialized = true;
        await meetupStore.loadMeetups();
        expect(meetupStore.isInitialized).toBe(true);
      });
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
      await meetupStore.createMeetup(mockTopicFields);
      expect(spiedOnApiCreateMeetup).toHaveBeenCalledWith(mockTopicFields);
    });

    describe('given API request resolves successfully', () => {
      it('should append the newly constructed meetup instance to meetups field array', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        const newMeetup = await meetupStore.createMeetup(mockTopicFields);
        expect(meetupStore.meetups).toContain(newMeetup);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetupStore = new MeetupStore(rootStore);

        await meetupStore.createMeetup(mockTopicFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiCreateMeetup.mockRejectedValue(appError);
      });

      it('should not add any elements to the meetups array', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        await meetupStore.createMeetup(mockMeetupFields);
        expect(meetupStore.meetups.length).toBe(0);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetupStore = new MeetupStore(rootStore);

        await meetupStore.createMeetup(mockMeetupFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('onMeetupDeleted() instance method', () => {
    it('should remove the deleted meetup instance from meetups field array', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      const newMeetup = await meetupStore.createMeetup(mockTopicFields);
      expect(newMeetup).not.toBeUndefined();
      meetupStore.onMeetupDeleted(newMeetup!);
      expect(meetupStore.meetups).not.toContain(newMeetup);
    });

    it('should push a success alert up to the root store', async () => {
      const rootStore = new RootStore();
      const spiedOnRootStoreOnAlert = jest.fn();
      const meetupStore = new MeetupStore(rootStore);
      const newMeetup = await meetupStore.createMeetup(mockTopicFields);
      rootStore.onAlert = spiedOnRootStoreOnAlert;

      meetupStore.onMeetupDeleted(newMeetup!);

      expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
      expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
        AlertSeverity.Success,
      );
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize only the meetups field', () => {
      const meetupStore = new MeetupStore(new RootStore());
      expect(JSON.stringify(meetupStore)).toBe(
        JSON.stringify({
          meetups: [],
        }),
      );
    });
  });
});

describe('Meetup', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
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
        getIds<IUser>(mockMeetupData.speakers),
      );
      expect(getIds<User>(meetup.votedUsers)).toEqual(
        getIds<IUser>(mockMeetupData.votedUsers),
      );
      expect(getIds<User>(meetup.participants)).toEqual(
        getIds<IUser>(mockMeetupData.participants),
      );
      expect(meetup.imageUrl).toBe(mockMeetupData.imageUrl);
      expect(meetup.image).toBeNull();
    });
  });

  describe('init() instance method', () => {
    describe('given imageUrl field is empty', () => {
      const meetupData: IMeetup = {
        ...mockMeetupData,
        imageUrl: null,
      };

      it('should not call API getStaticFile() function', async () => {
        const meetup = new Meetup(meetupData, mockMeetupStore);
        const initializedMeetup = await meetup.init();
        expect(spiedOnGetStaticFile).not.toHaveBeenCalled();
      });

      it('should set isInitialized to true and leave the image field empty', async () => {
        const meetup = new Meetup(meetupData, mockMeetupStore);
        const initializedMeetup = await meetup.init();
        expect(initializedMeetup.isInitialized).toBe(true);
        expect(initializedMeetup.image).toBeNull();
      });
    });

    describe('given imageUrl field is not empty', () => {
      it('should call API getStaticFile() function', async () => {
        const meetup = new Meetup(mockMeetupData, mockMeetupStore);
        const initializedMeetup = await meetup.init();
        expect(spiedOnGetStaticFile).toHaveBeenCalledWith(meetup.imageUrl);
      });

      describe('given API request resolves successfully', () => {
        it('should set isInitialized to true and fill the image field with the fetched image', async () => {
          spiedOnGetStaticFile.mockResolvedValue(mockImageWithUrl);
          const meetup = new Meetup(mockMeetupData, mockMeetupStore);
          const initializedMeetup = await meetup.init();
          expect(initializedMeetup.isInitialized).toBe(true);
          expect(initializedMeetup.image).toStrictEqual(mockImageWithUrl);
        });
      });

      describe('given API request rejects with an error', () => {
        beforeEach(() => {
          spiedOnGetStaticFile.mockRejectedValue(appError);
        });

        it('should set isInitialized to false and leave the image field empty', async () => {
          const meetup = new Meetup(mockMeetupData, mockMeetupStore);
          const initializedMeetup = await meetup.init();
          expect(initializedMeetup.isInitialized).toBe(false);
          expect(initializedMeetup.image).toBeNull();
        });

        it('should push an error alert up to the root store', async () => {
          const rootStore = new RootStore();
          const spiedOnRootStoreOnAlert = jest.fn();
          rootStore.onAlert = spiedOnRootStoreOnAlert;
          const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);

          const initializedMeetup = await meetup.init();

          expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
          expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
            AlertSeverity.Error,
          );
        });
      });
    });
  });

  describe('update() instance method', () => {
    beforeEach(() => {
      spiedOnApiUpdateMeetup.mockResolvedValue(mockMeetupDraftFilledData);
      spiedOnGetStaticFile.mockResolvedValue(mockMeetupFields.image!);
    });

    it('should call API updateMeetup() function', async () => {
      const meetup = new Meetup(mockMeetupDraftData, mockMeetupStore);
      await meetup.update(mockMeetupFields);
      expect(spiedOnApiUpdateMeetup).toHaveBeenCalledWith(
        meetup.id,
        mockMeetupFields,
      );
    });

    describe('given API request resolves successfully', () => {
      it('should update meetups instance fields', async () => {
        const meetup = new Meetup(mockTopicData, mockMeetupStore);
        await meetup.update(mockMeetupFields);
        expect(meetup.start).toBe(mockMeetupFields.start);
        expect(meetup.finish).toBe(mockMeetupFields.finish);
        expect(meetup.place).toBe(mockMeetupFields.place);
        expect(meetup.image).toBe(mockMeetupFields.image);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(mockTopicData, rootStore.meetupStore);

        await meetup.update(mockMeetupFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiUpdateMeetup.mockRejectedValue(appError);
      });

      it('should leave meetup instance data untouched', async () => {
        const meetup = new Meetup(mockTopicData, mockMeetupStore);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;
        await meetup.update(mockMeetupFields);
        expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(mockTopicData, rootStore.meetupStore);

        await meetup.update(mockMeetupFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('approve() instance method', () => {
    describe('given a meetup in topic stage', () => {
      it('should call API updateMeetup() function', async () => {
        const meetup = new Meetup(mockTopicData, mockMeetupStore);
        await meetup.approve();
        expect(spiedOnApiUpdateMeetup).toHaveBeenCalledWith(
          meetup.id,
          {},
          MeetupStatus.DRAFT,
        );
      });

      describe('given API request resolves successfully', () => {
        beforeEach(() => {
          spiedOnApiUpdateMeetup.mockResolvedValue(mockMeetupDraftData);
        });

        it('should set meetup status to DRAFT', async () => {
          const meetup = new Meetup(mockTopicData, mockMeetupStore);
          const meetupSnapshot = Object.assign({}, meetup) as Meetup;
          await meetup.approve();
          expect(meetup.status).toBe(MeetupStatus.DRAFT);
          expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
        });

        it('should push a success alert up to the root store', async () => {
          const rootStore = new RootStore();
          const spiedOnRootStoreOnAlert = jest.fn();
          rootStore.onAlert = spiedOnRootStoreOnAlert;
          const meetup = new Meetup(mockTopicData, rootStore.meetupStore);

          await meetup.approve();

          expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
          expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
            AlertSeverity.Success,
          );
        });
      });

      describe('given API request rejects with an error', () => {
        beforeEach(() => {
          spiedOnApiUpdateMeetup.mockRejectedValue(appError);
        });

        it('should not touch meetup status', async () => {
          const meetup = new Meetup(mockTopicData, mockMeetupStore);
          const meetupSnapshot = Object.assign({}, meetup) as Meetup;
          await meetup.approve();
          expect(meetup.status).toBe(meetupSnapshot.status);
          expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
        });

        it('should push an error alert up to the root store', async () => {
          const rootStore = new RootStore();
          const spiedOnRootStoreOnAlert = jest.fn();
          rootStore.onAlert = spiedOnRootStoreOnAlert;
          const meetup = new Meetup(mockTopicData, rootStore.meetupStore);

          await meetup.approve();

          expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
          expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
            AlertSeverity.Error,
          );
        });
      });
    });

    describe('given a meetup after approval', () => {
      it('should not call API updateMeetup() function', async () => {
        const meetup = new Meetup(mockMeetupData, mockMeetupStore);
        await meetup.approve();
        expect(spiedOnApiUpdateMeetup).not.toHaveBeenCalled();
      });

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
        it('should call API updateMeetup() function', async () => {
          const meetup = new Meetup(mockMeetupDraftFilledData, mockMeetupStore);
          await meetup.publish();
          expect(spiedOnApiUpdateMeetup).toHaveBeenCalledWith(
            meetup.id,
            {},
            MeetupStatus.CONFIRMED,
          );
        });

        describe('given API request resolves successfully', () => {
          beforeEach(() => {
            spiedOnApiUpdateMeetup.mockResolvedValue(mockMeetupData);
          });

          it('should set meetup status to CONFIRMED', async () => {
            const meetup = new Meetup(
              mockMeetupDraftFilledData,
              mockMeetupStore,
            );
            const meetupSnapshot = Object.assign({}, meetup) as Meetup;
            await meetup.publish();
            expect(meetup.status).toBe(MeetupStatus.CONFIRMED);
            expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
          });

          it('should push a success alert up to the root store', async () => {
            const rootStore = new RootStore();
            const spiedOnRootStoreOnAlert = jest.fn();
            rootStore.onAlert = spiedOnRootStoreOnAlert;
            const meetup = new Meetup(
              mockMeetupDraftFilledData,
              rootStore.meetupStore,
            );

            await meetup.publish();

            expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
            expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
              AlertSeverity.Success,
            );
          });
        });

        describe('given API request rejects with an error', () => {
          beforeEach(() => {
            spiedOnApiUpdateMeetup.mockRejectedValue(appError);
          });

          it('should not touch meetup status', async () => {
            const meetup = new Meetup(
              mockMeetupDraftFilledData,
              mockMeetupStore,
            );
            const meetupSnapshot = Object.assign({}, meetup) as Meetup;
            await meetup.publish();
            expect(meetup.status).toBe(meetupSnapshot.status);
            expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
          });

          it('should push an error alert up to the root store', async () => {
            const rootStore = new RootStore();
            const spiedOnRootStoreOnAlert = jest.fn();
            rootStore.onAlert = spiedOnRootStoreOnAlert;
            const meetup = new Meetup(
              mockMeetupDraftFilledData,
              rootStore.meetupStore,
            );

            await meetup.publish();

            expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
            expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
              AlertSeverity.Error,
            );
          });
        });
      });

      describe('given either start date, or finish date, or location is not filled', () => {
        it('should not call API updateMeetup() function', async () => {
          const meetup = new Meetup(mockMeetupDraftData, mockMeetupStore);
          await meetup.publish();
          expect(spiedOnApiUpdateMeetup).not.toHaveBeenCalled();
        });

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
      it('should not call API updateMeetup() function', async () => {
        const meetup = new Meetup(mockTopicData, mockMeetupStore);
        await meetup.publish();
        expect(spiedOnApiUpdateMeetup).not.toHaveBeenCalled();
      });

      it('should not touch meetup status', async () => {
        const meetup = new Meetup(mockTopicData, mockMeetupStore);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;
        await meetup.publish();
        expect(meetup.status).toBe(meetupSnapshot.status);
        expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
      });
    });
  });

  describe('actor instance property', () => {
    it('should return the loggedUser field of the upstream AuthStore', () => {
      const rootStore = new RootStore();
      rootStore.authStore.loggedUser = mockFullUser;
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      expect(meetup!.actor).toBe(mockFullUser);
    });
  });

  describe('canLoggedUserSupport instance property', () => {
    it('should return false if no user is logged in', () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(null);
      expect(meetup!.canLoggedUserSupport).toBe(false);
    });

    it('should return false if the logged user is the author of the meetup', () => {
      const rootStore = new RootStore();
      const meetupData: IMeetup = {
        ...mockMeetupData,
        author: mockUserData,
      };
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser);
      expect(meetup!.canLoggedUserSupport).toBe(false);
    });

    it('should return false if the logged user is one of the speakers of the meetup', () => {
      const rootStore = new RootStore();
      const meetupData: IMeetup = {
        ...mockMeetupData,
        speakers: [mockUserData],
      };
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser);
      expect(meetup!.canLoggedUserSupport).toBe(false);
    });

    it('should return true if the logged user is neither the author, nor one of the speakers of the meetup', () => {
      const rootStore = new RootStore();
      const meetupData: IMeetup = {
        ...mockMeetupData,
        author: mockUser2Data,
        speakers: [mockUser2Data],
      };
      const meetup = new Meetup(meetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser);
      expect(meetup!.canLoggedUserSupport).toBe(true);
    });
  });

  describe('hasLoggedUserVoted instance property', () => {
    it('should return false if no user is logged in', () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(null);
      expect(meetup!.hasLoggedUserVoted).toBe(false);
    });

    it('should return true if logged user is in the list of voted users', () => {
      const rootStore = new RootStore();
      const meetupData: IMeetup = {
        ...mockMeetupData,
        votedUsers: [mockUserData],
      };
      const meetup = new Meetup(meetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser);
      expect(meetup!.hasLoggedUserVoted).toBe(true);
    });

    it('should return false is logged user is not in the list of voted users', () => {
      const rootStore = new RootStore();
      const meetupData: IMeetup = {
        ...mockMeetupData,
        votedUsers: [mockUser2Data],
      };
      const meetup = new Meetup(meetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser);
      expect(meetup!.hasLoggedUserVoted).toBe(false);
    });
  });

  describe('vote() instance method', () => {
    it('should not call API voteForMeetup() if meetup is not in request stage', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
      await meetup.vote();
      expect(spiedOnApiVoteForMeetup).not.toHaveBeenCalled();
    });

    it('should not call API voteForMeetup() if no user is logged in', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(null);
      await meetup.vote();
      expect(spiedOnApiVoteForMeetup).not.toHaveBeenCalled();
    });

    it('should not call API voteForMeetup() if canLoggedUserSupport property returns false', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser);
      jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(false);
      await meetup.vote();
      expect(spiedOnApiVoteForMeetup).not.toHaveBeenCalled();
    });

    describe('given API request resolves successfully', () => {
      it('should add the logged user to the beginning of voted users list', async () => {
        const rootStore = new RootStore();
        const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);

        await meetup.vote();

        expect(spiedOnApiVoteForMeetup).toHaveBeenCalled();
        expect(meetup.votedUsers[0]).toStrictEqual(mockUser2);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);

        await meetup.vote();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiVoteForMeetup.mockRejectedValue(appError);
      });

      it('should not touch the voted users list', async () => {
        const rootStore = new RootStore();
        const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;

        await meetup.vote();

        expect(meetup.votedUsers).toStrictEqual(meetupSnapshot.votedUsers);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);

        await meetup.vote();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('withdrawVote() instance method', () => {
    it('should not call API withdrawVoteForMeetup() if meetup is not in request stage', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
      await meetup.withdrawVote();
      expect(spiedOnApiWithdrawVoteForMeetup).not.toHaveBeenCalled();
    });

    it('should not call API withdrawVoteForMeetup() if no user is logged in', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(null);
      await meetup.withdrawVote();
      expect(spiedOnApiWithdrawVoteForMeetup).not.toHaveBeenCalled();
    });

    describe('given API request resolves successfully', () => {
      const meetupData: IMeetup = {
        ...mockTopicData,
        votedUsers: [mockUser2, mockUser],
      };

      it('should remove the logged user from voted users list', async () => {
        const rootStore = new RootStore();
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);

        await meetup.withdrawVote();

        expect(spiedOnApiWithdrawVoteForMeetup).toHaveBeenCalled();
        expect(meetup.votedUsers.length).toBe(1);
        expect(meetup.votedUsers[0]).toStrictEqual(mockUser);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);

        await meetup.withdrawVote();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiWithdrawVoteForMeetup.mockRejectedValue(appError);
      });

      const meetupData: IMeetup = {
        ...mockTopicData,
        votedUsers: [mockUser2, mockUser],
      };

      it('should not touch the voted users list', async () => {
        const rootStore = new RootStore();
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;

        await meetup.withdrawVote();

        expect(meetup.votedUsers).toStrictEqual(meetupSnapshot.votedUsers);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);

        await meetup.withdrawVote();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('hasLoggedUserJoined instance property', () => {
    it('should return false if no user is logged in', () => {
      const rootStore = new RootStore();
      rootStore.authStore.loggedUser = null;
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      expect(meetup!.hasLoggedUserJoined).toBe(false);
    });

    it('should return true if logged user is in the list of joined users', () => {
      const rootStore = new RootStore();
      rootStore.authStore.loggedUser = mockFullUser;
      const meetupData: IMeetup = {
        ...mockMeetupData,
        participants: [mockUserData],
      };
      const meetup = new Meetup(meetupData, rootStore.meetupStore);
      expect(meetup!.hasLoggedUserJoined).toBe(true);
    });

    it('should return false is logged user is not in the list of joined users', () => {
      const rootStore = new RootStore();
      rootStore.authStore.loggedUser = mockFullUser;
      const meetupData: IMeetup = {
        ...mockMeetupData,
        participants: [mockUser2Data],
      };
      const meetup = new Meetup(meetupData, rootStore.meetupStore);
      expect(meetup!.hasLoggedUserJoined).toBe(false);
    });
  });

  describe('join() instance method', () => {
    it('should not call API joinMeetup() if meetup is not in confirmed stage', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
      await meetup.join();
      expect(spiedOnApiJoinMeetup).not.toHaveBeenCalled();
    });

    it('should not call API joinMeetup() if meetup is already finished', async () => {
      const rootStore = new RootStore();
      const finish: Date = faker.date.past();
      const meetupData: IMeetup = {
        ...mockMeetupData,
        start: new Date(finish.getTime() - 2 * 60 * 60 * 1000),
        finish,
      };
      const meetup = new Meetup(meetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
      await meetup.join();
      expect(spiedOnApiJoinMeetup).not.toHaveBeenCalled();
    });

    it('should not call API joinMeetup() if no user is logged in', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(null);
      await meetup.join();
      expect(spiedOnApiJoinMeetup).not.toHaveBeenCalled();
    });

    it('should not call API joinMeetup() if canLoggedUserSupport property returns false', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser);
      jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(false);
      await meetup.vote();
      expect(spiedOnApiVoteForMeetup).not.toHaveBeenCalled();
    });

    describe('given API request resolves successfully', () => {
      it('should add the logged user to the beginning of participants list', async () => {
        const rootStore = new RootStore();
        const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);

        await meetup.join();

        expect(spiedOnApiJoinMeetup).toHaveBeenCalled();
        expect(meetup.participants[0]).toStrictEqual(mockUser2);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);

        await meetup.join();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiJoinMeetup.mockRejectedValue(appError);
      });

      it('should not touch the participants list', async () => {
        const rootStore = new RootStore();
        const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;

        await meetup.join();

        expect(meetup.participants).toStrictEqual(meetupSnapshot.participants);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        jest.spyOn(meetup, 'canLoggedUserSupport', 'get').mockReturnValue(true);

        await meetup.join();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('cancelJoin() instance method', () => {
    it('should not call API joinMeetup() if meetup is not in confirmed stage', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockTopicData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
      await meetup.cancelJoin();
      expect(spiedOnApiCancelJoinMeetup).not.toHaveBeenCalled();
    });

    it('should not call API joinMeetup() if meetup is already finished', async () => {
      const rootStore = new RootStore();
      const finish: Date = faker.date.past();
      const meetupData: IMeetup = {
        ...mockMeetupData,
        start: new Date(finish.getTime() - 2 * 60 * 60 * 1000),
        finish,
      };
      const meetup = new Meetup(meetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
      await meetup.cancelJoin();
      expect(spiedOnApiCancelJoinMeetup).not.toHaveBeenCalled();
    });

    it('should not call API joinMeetup() if no user is logged in', async () => {
      const rootStore = new RootStore();
      const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);
      jest.spyOn(meetup, 'actor', 'get').mockReturnValue(null);
      await meetup.cancelJoin();
      expect(spiedOnApiCancelJoinMeetup).not.toHaveBeenCalled();
    });

    describe('given API request resolves successfully', () => {
      it('should remove the logged user from participants list', async () => {
        const rootStore = new RootStore();
        const meetupData: IMeetup = {
          ...mockMeetupData,
          participants: [mockUser2, mockUser],
        };
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);

        await meetup.cancelJoin();

        expect(spiedOnApiCancelJoinMeetup).toHaveBeenCalled();
        expect(meetup.participants.length).toBe(1);
        expect(meetup.participants[0]).toStrictEqual(mockUser);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetupData: IMeetup = {
          ...mockMeetupData,
          participants: [mockUser2, mockUser],
        };
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);

        await meetup.cancelJoin();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiCancelJoinMeetup.mockRejectedValue(appError);
      });

      it('should not touch the participants list', async () => {
        const rootStore = new RootStore();
        const meetupData: IMeetup = {
          ...mockMeetupData,
          participants: [mockUser2, mockUser],
        };
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;

        await meetup.cancelJoin();

        expect(meetup.participants).toStrictEqual(meetupSnapshot.participants);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetupData: IMeetup = {
          ...mockMeetupData,
          participants: [mockUser2, mockUser],
        };
        const meetup = new Meetup(meetupData, rootStore.meetupStore);
        jest.spyOn(meetup, 'actor', 'get').mockReturnValue(mockFullUser2);

        await meetup.cancelJoin();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('delete() instance method', () => {
    it('should call API deleteMeetup() function', async () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      await meetup.delete();
      expect(spiedOnApiDeleteMeetup).toHaveBeenCalledWith(meetup.id);
    });

    describe('given API request resolves successfully', () => {
      it("should call meetup store's onMeetupDeleted() method", async () => {
        const spiedOnNewsStoreMeetupDeleted = jest.spyOn(
          MeetupStore.prototype,
          'onMeetupDeleted',
        );
        const meetup = new Meetup(mockMeetupData, mockMeetupStore);
        await meetup.delete();
        expect(spiedOnNewsStoreMeetupDeleted).toHaveBeenCalledWith(meetup);
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiDeleteMeetup.mockRejectedValue(appError);
      });

      it("should not call the meetup store's onMeetupDeleted() method", async () => {
        const spiedOnNewsStoreMeetupDeleted = jest.spyOn(
          MeetupStore.prototype,
          'onMeetupDeleted',
        );

        const meetup = new Meetup(
          mockMeetupData,
          new MeetupStore(new RootStore()),
        );
        await meetup.delete();

        expect(spiedOnNewsStoreMeetupDeleted).not.toHaveBeenCalled();
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const meetup = new Meetup(mockMeetupData, rootStore.meetupStore);

        await meetup.delete();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize to IMeetup', () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      expect(meetup.toJSON()).toEqual(mockMeetupData);
    });
  });
});
