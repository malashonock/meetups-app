import * as MobX from 'mobx';
import { AxiosError } from 'axios';

import { MeetupStore, RootStore, Meetup, User } from 'stores';
import * as MeetupApi from 'api/services/meetup.service';
import * as FileApi from 'api/services/static.service';
import { MeetupStatus, IUser, IMeetup } from 'model';
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
  mockImageWithUrl,
} from 'model/__fakes__';

const spiedOnMobXMakeObservable = jest.spyOn(MobX, 'makeObservable');
const spiedOnApiGetMeetups = jest.spyOn(MeetupApi, 'getMeetups');
const spiedOnApiCreateMeetup = jest.spyOn(MeetupApi, 'createMeetup');
const spiedOnApiUpdateMeetup = jest.spyOn(MeetupApi, 'updateMeetup');
const spiedOnApiDeleteMeetup = jest.spyOn(MeetupApi, 'deleteMeetup');
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
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
      const meetupStore = new MeetupStore(new RootStore());

      expect(meetupStore.isLoading).toBe(false);
      expect(meetupStore.isError).toBe(false);
      expect(meetupStore.errors.length).toBe(0);

      expect(meetupStore.meetups.length).toBe(0);
    });
  });

  describe('loadMeetups() instance method', () => {
    it('should call API getMeetups() method', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      await meetupStore.loadMeetups();
      expect(spiedOnApiGetMeetups).toHaveBeenCalled();
    });

    it('should be in isLoading state while API is running the request', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      const loadMeetupsTask = meetupStore.loadMeetups();
      expect(meetupStore.isLoading).toBe(true);
      await loadMeetupsTask;
      expect(meetupStore.isLoading).toBe(false);
    });

    describe('given API request resolves successfully', () => {
      it('should populate meetups field with fetched meetups', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        await meetupStore.loadMeetups();

        expect(meetupStore.isLoading).toBe(false);
        expect(meetupStore.isError).toBe(false);
        expect(meetupStore.errors.length).toBe(0);

        expect(meetupStore.meetups.length).toBe(mockMeetupsData.length);
        expect(JSON.stringify(meetupStore.meetups)).toBe(
          JSON.stringify(mapMeetupsData(mockMeetupsData, meetupStore)),
        );
      });
    });

    describe('given API request rejects with an error', () => {
      const ERROR_CODE = '404';
      const ERROR_MESSAGE = 'Resource not found';

      beforeEach(() => {
        spiedOnApiGetMeetups.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('should populate errors field with the caught error', async () => {
        const meetupStore = new MeetupStore(new RootStore());

        await meetupStore.loadMeetups();

        expect(meetupStore.isLoading).toBe(false);
        expect(meetupStore.isError).toBe(true);
        expect(meetupStore.errors.length).toBe(1);
        expect((meetupStore.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((meetupStore.errors[0] as AxiosError).message).toBe(
          ERROR_MESSAGE,
        );
      });

      it('should not add any elements to the meetups array', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        await meetupStore.loadMeetups();
        expect(meetupStore.meetups.length).toBe(0);
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

    it('should be in isLoading state while API is running the request', async () => {
      const meetupStore = new MeetupStore(new RootStore());
      const createMeetupTask = meetupStore.createMeetup(mockMeetupFields);
      expect(meetupStore.isLoading).toBe(true);
      await createMeetupTask;
      expect(meetupStore.isLoading).toBe(false);
    });

    describe('given API request resolves successfully', () => {
      it('should append the newly constructed meetup instance to meetups field array', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        const newMeetup = await meetupStore.createMeetup(mockTopicFields);
        expect(meetupStore.meetups).toContain(newMeetup);
      });
    });

    describe('given API request rejects with an error', () => {
      const ERROR_CODE = '403';
      const ERROR_MESSAGE = 'Forbidden';

      beforeEach(() => {
        spiedOnApiCreateMeetup.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('should populate errors field with the caught error', async () => {
        const meetupStore = new MeetupStore(new RootStore());

        await meetupStore.createMeetup(mockMeetupFields);

        expect(meetupStore.isLoading).toBe(false);
        expect(meetupStore.isError).toBe(true);
        expect(meetupStore.errors.length).toBe(1);
        expect((meetupStore.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((meetupStore.errors[0] as AxiosError).message).toBe(
          ERROR_MESSAGE,
        );
      });

      it('should not add any elements to the meetups array', async () => {
        const meetupStore = new MeetupStore(new RootStore());
        await meetupStore.createMeetup(mockMeetupFields);
        expect(meetupStore.meetups.length).toBe(0);
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
      expect(meetup.isLoading).toBe(false);
      expect(meetup.isError).toBe(false);
      expect(meetup.errors.length).toBe(0);

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
    });
  });

  describe('update() instance method', () => {
    beforeEach(() => {
      spiedOnApiUpdateMeetup.mockReturnValue(
        Promise.resolve(mockMeetupDraftFilledData),
      );
      spiedOnGetStaticFile.mockReturnValue(
        Promise.resolve(mockMeetupFields.image!),
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

    it('should be in isLoading state while API is running the request', async () => {
      const meetup = new Meetup(mockMeetupDraftData);
      const updateMeetupTask = meetup.update(mockMeetupFields);
      expect(meetup.isLoading).toBe(true);
      await updateMeetupTask;
      expect(meetup.isLoading).toBe(false);
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
    });

    describe('given API request rejects with an error', () => {
      const ERROR_CODE = '500';
      const ERROR_MESSAGE = 'Internal server error';

      beforeEach(() => {
        spiedOnApiUpdateMeetup.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('populate errors field with the caught error', async () => {
        const meetup = new Meetup(mockTopicData);

        await meetup.update(mockMeetupFields);

        expect(meetup.isLoading).toBe(false);
        expect(meetup.isError).toBe(true);
        expect(meetup.errors.length).toBe(1);
        expect((meetup.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((meetup.errors[0] as AxiosError).message).toBe(ERROR_MESSAGE);
      });

      it('should leave meetup instance data untouched', async () => {
        const meetup = new Meetup(mockTopicData);
        const meetupSnapshot = Object.assign({}, meetup) as Meetup;
        await meetup.update(mockMeetupFields);
        expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
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

      describe('given API request rejects with an error', () => {
        const ERROR_CODE = '403';
        const ERROR_MESSAGE = 'Forbidden';

        beforeEach(() => {
          spiedOnApiUpdateMeetup.mockImplementation(() => {
            throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
          });
        });

        it('populate errors field with the caught error', async () => {
          const meetup = new Meetup(mockTopicData);

          await meetup.approve();

          expect(meetup.isLoading).toBe(false);
          expect(meetup.isError).toBe(true);
          expect(meetup.errors.length).toBe(1);
          expect((meetup.errors[0] as AxiosError).code).toBe(ERROR_CODE);
          expect((meetup.errors[0] as AxiosError).message).toBe(ERROR_MESSAGE);
        });

        it('should not touch meetup status', async () => {
          const meetup = new Meetup(mockTopicData);
          const meetupSnapshot = Object.assign({}, meetup) as Meetup;
          await meetup.approve();
          expect(meetup.status).toBe(meetupSnapshot.status);
          expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
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
          it('should set meetup status to CONFIRMED', async () => {
            spiedOnApiUpdateMeetup.mockReturnValue(
              Promise.resolve(mockMeetupData),
            );
            const meetup = new Meetup(
              mockMeetupDraftFilledData,
              mockMeetupStore,
            );
            const meetupSnapshot = Object.assign({}, meetup) as Meetup;
            await meetup.publish();
            expect(meetup.status).toBe(MeetupStatus.CONFIRMED);
            expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
          });
        });

        describe('given API request rejects with an error', () => {
          const ERROR_CODE = '403';
          const ERROR_MESSAGE = 'Forbidden';

          beforeEach(() => {
            spiedOnApiUpdateMeetup.mockImplementation(() => {
              throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
            });
          });

          it('populate errors field with the caught error', async () => {
            const meetup = new Meetup(mockMeetupDraftFilledData);

            await meetup.publish();

            expect(meetup.isLoading).toBe(false);
            expect(meetup.isError).toBe(true);
            expect(meetup.errors.length).toBe(1);
            expect((meetup.errors[0] as AxiosError).code).toBe(ERROR_CODE);
            expect((meetup.errors[0] as AxiosError).message).toBe(
              ERROR_MESSAGE,
            );
          });

          it('should not touch meetup status', async () => {
            const meetup = new Meetup(mockMeetupDraftFilledData);
            const meetupSnapshot = Object.assign({}, meetup) as Meetup;
            await meetup.publish();
            expect(meetup.status).toBe(meetupSnapshot.status);
            expectMeetupFieldsNotChanged(meetup, meetupSnapshot);
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

  describe('delete() instance method', () => {
    it('should call API deleteMeetup() function', async () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      await meetup.delete();
      expect(spiedOnApiDeleteMeetup).toHaveBeenCalledWith(meetup.id);
    });

    it('should be in isLoading state while API is running the request', async () => {
      const meetup = new Meetup(mockMeetupData);
      const deleteMeetupTask = meetup.delete();
      expect(meetup.isLoading).toBe(true);
      await deleteMeetupTask;
      expect(meetup.isLoading).toBe(false);
    });

    describe('given API request resolves successfully', () => {
      it('given a meetups store, should call its onMeetupDeleted() method', async () => {
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
      const ERROR_CODE = '403';
      const ERROR_MESSAGE = 'Forbidden';

      beforeEach(() => {
        spiedOnApiDeleteMeetup.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('should populate errors field with the caught error', async () => {
        const meetup = new Meetup(
          mockMeetupData,
          new MeetupStore(new RootStore()),
        );
        await meetup.delete();

        expect(meetup.isLoading).toBe(false);
        expect(meetup.isError).toBe(true);
        expect(meetup.errors.length).toBe(1);
        expect((meetup.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((meetup.errors[0] as AxiosError).message).toBe(ERROR_MESSAGE);
      });

      it('given a news store, should not call its onMeetupDeleted() method', async () => {
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
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize to IMeetup', () => {
      const meetup = new Meetup(mockMeetupData, mockMeetupStore);
      expect(meetup.toJSON()).toEqual(mockMeetupData);
    });
  });
});
