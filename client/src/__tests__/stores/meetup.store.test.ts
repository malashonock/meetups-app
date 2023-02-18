import * as MobX from 'mobx';

import { MeetupStore, RootStore, Meetup } from 'stores';
import * as MeetupApi from 'api/services/meetup.service';
import { IMeetup, MeetupFields } from 'model';
import {
  generateMeetupsData,
  mapMeetupsData,
  mockMeetup,
  mockTopicData,
} from 'model/__fakes__';

const spiedOnMobXMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');
const spiedOnApiGetMeetups = jest.spyOn(MeetupApi, 'getMeetups');
const spiedOnApiCreateMeetup = jest.spyOn(MeetupApi, 'createMeetup');
const spiedOnApiUpdateMeetup = jest.spyOn(MeetupApi, 'updateMeetup');
const spiedOnApiDeleteMeetup = jest.spyOn(MeetupApi, 'deleteMeetup');

const mockMeetupsData: IMeetup[] = generateMeetupsData(1);

// const updatedMeetupFields: Partial<MeetupFields> = {
//   title: 'Updated meetups title',
//   text: 'Updated meetups text',
//   image: mockImageWithUrl2,
// };

// const updatedNewsArticleData: INews = {
//   ...mockNewsArticleData,
//   ...updatedMeetupFields,
// };

beforeEach(() => {
  spiedOnApiGetMeetups.mockReturnValue(Promise.resolve(mockMeetupsData));
  spiedOnApiCreateMeetup.mockReturnValue(Promise.resolve(mockTopicData));
  // spiedOnApiUpdateMeetup.mockReturnValue(
  //   Promise.resolve(updatedNewsArticleData),
  // );
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

// describe('News', () => {
//   describe('constructor', () => {
//     describe('given meetups store is passed', () => {
//       it('should make the returned instance observable', () => {
//         const meetupStore = new MeetupStore(new RootStore());
//         const newsArticle = new News(mockNewsArticleData, meetupStore);
//         expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(newsArticle);
//       });
//     });

//     describe('given meetups store is not passed', () => {
//       it('should not make the returned instance observable', () => {
//         const newsArticle = new News(mockNewsArticleData);
//         expect(spiedOnMobXMakeAutoObservable).not.toHaveBeenCalled();
//       });
//     });

//     it('should initialize meetups fields with meetups data', () => {
//       const newsArticle = new News(mockNewsArticleData);
//       expect(newsArticle.meetupStore).toBeNull();
//       expect(newsArticle.id).toBe(mockNewsArticleData.id);
//       expect(newsArticle.publicationDate).toBe(
//         mockNewsArticleData.publicationDate,
//       );
//       expect(newsArticle.title).toBe(mockNewsArticleData.title);
//       expect(newsArticle.text).toBe(mockNewsArticleData.text);
//       expect(newsArticle.image).toBe(mockNewsArticleData.image);
//     });
//   });

//   describe('update() instance method', () => {
//     it('should call API updateMeetup() function', async () => {
//       const newsArticle = new News(mockNewsArticleData);
//       await newsArticle.update(updatedMeetupFields);
//       expect(spiedOnApiUpdateMeetup).toHaveBeenCalledWith(
//         newsArticle.id,
//         updatedMeetupFields,
//       );
//     });

//     it('should update meetups instance fields', async () => {
//       const newsArticle = new News(mockNewsArticleData);
//       await newsArticle.update(updatedMeetupFields);
//       expect(newsArticle.title).toBe(updatedMeetupFields.title);
//       expect(newsArticle.text).toBe(updatedMeetupFields.text);
//       expect(newsArticle.image).toBe(updatedMeetupFields.image);
//     });
//   });

//   describe('delete() instance method', () => {
//     it('should call API deleteMeetup() function', async () => {
//       const newsArticle = new News(mockNewsArticleData);
//       await newsArticle.delete();
//       expect(spiedOnApiDeleteMeetup).toHaveBeenCalledWith(newsArticle.id);
//     });

//     it('given a meetups store, should call its onMeetupDeleted() method', async () => {
//       const spiedOnNewsStoreOnNewsArticleDeleted = jest.spyOn(
//         MeetupStore.prototype,
//         'onMeetupDeleted',
//       );
//       const newsArticle = new News(
//         mockNewsArticleData,
//         new MeetupStore(new RootStore()),
//       );
//       await newsArticle.delete();
//       expect(spiedOnNewsStoreOnNewsArticleDeleted).toHaveBeenCalledWith(
//         newsArticle,
//       );
//     });
//   });

//   describe('toJSON instance() method', () => {
//     it('should serialize to IUser', () => {
//       const newsArticle = new News(mockNewsArticleData);
//       expect(JSON.stringify(newsArticle)).toBe(
//         JSON.stringify(mockNewsArticleData),
//       );
//     });
//   });
// });
