import * as MobX from 'mobx';
import { AxiosError } from 'axios';

import { NewsStore, RootStore, News } from 'stores';
import * as NewsApi from 'api/services/news.service';
import {
  mockNewsData,
  mockNews,
  mockNewsArticle,
  mockNewsArticleData,
  mockNewsArticleFields,
  mockUpdatedNewsArticleData,
  mockUpdatedNewsArticleFields,
} from 'model/__fakes__';
import { AppError } from 'model';
import { AlertSeverity } from 'types';

const spiedOnMobXMakeObservable = jest.spyOn(MobX, 'makeObservable');
const spiedOnApiGetNews = jest.spyOn(NewsApi, 'getNews');
const spiedOnApiCreateNewsArticle = jest.spyOn(NewsApi, 'createNewsArticle');
const spiedOnApiUpdateNewsArticle = jest.spyOn(NewsApi, 'updateNewsArticle');
const spiedOnApiDeleteNewsArticle = jest.spyOn(NewsApi, 'deleteNewsArticle');

const ERROR_CODE = '500';
const ERROR_PROBLEM = 'Internal server error';
const ERROR_HINT = 'File a ticket to tech support';
const appError = new AppError(ERROR_CODE, ERROR_PROBLEM, ERROR_HINT);

beforeEach(() => {
  spiedOnApiGetNews.mockResolvedValue(mockNewsData);
  spiedOnApiCreateNewsArticle.mockResolvedValue(mockNewsArticleData);
  spiedOnApiUpdateNewsArticle.mockResolvedValue(mockUpdatedNewsArticleData);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('NewsStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const newsStore = new NewsStore(new RootStore());
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
      const newsStore = new NewsStore(new RootStore());

      expect(newsStore.news.length).toBe(0);
      expect(newsStore.isInitialized).toBe(false);
      expect(newsStore.onError).toBeTruthy();
    });
  });

  describe('loadNews() instance method', () => {
    describe('given isInitialized is false', () => {
      it('should call API getNews() method', async () => {
        const newsStore = new NewsStore(new RootStore());
        await newsStore.loadNews();
        expect(spiedOnApiGetNews).toHaveBeenCalled();
      });

      describe('given API request resolves successfully', () => {
        it('should populate news field with fetched news', async () => {
          const newsStore = new NewsStore(new RootStore());
          await newsStore.loadNews();

          expect(newsStore.news.length).toBe(mockNews.length);
          expect(JSON.stringify(newsStore.news)).toBe(JSON.stringify(mockNews));
        });

        it('should set isInitialized field to true', async () => {
          const newsStore = new NewsStore(new RootStore());
          await newsStore.loadNews();

          expect(newsStore.isInitialized).toBe(true);
        });
      });

      describe('given API request rejects with an error', () => {
        beforeEach(() => {
          spiedOnApiGetNews.mockRejectedValue(appError);
        });

        it('should not add any elements to the news array', async () => {
          const newsStore = new NewsStore(new RootStore());
          await newsStore.loadNews();
          expect(newsStore.news.length).toBe(0);
        });

        it('should leave isInitialized field false', async () => {
          const newsStore = new NewsStore(new RootStore());
          await newsStore.loadNews();
          expect(newsStore.isInitialized).toBe(false);
        });

        it('should push an error alert up to the root store', async () => {
          const rootStore = new RootStore();
          const spiedOnRootStoreOnAlert = jest.fn();
          rootStore.onAlert = spiedOnRootStoreOnAlert;
          const newsStore = new NewsStore(rootStore);

          await newsStore.loadNews();

          expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
          expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
            AlertSeverity.Error,
          );
        });
      });
    });

    describe('given isInitialized is true', () => {
      it('should not call API getMeetups() method', async () => {
        const newsStore = new NewsStore(new RootStore());
        newsStore.isInitialized = true;

        await newsStore.loadNews();

        expect(spiedOnApiGetNews).not.toHaveBeenCalled();
      });

      it('should leave the news field untouched', async () => {
        const newsStore = new NewsStore(new RootStore());
        newsStore.isInitialized = true;
        await newsStore.loadNews();
        expect(newsStore.news.length).toBe(0);
      });

      it('should leave isInitialized field true', async () => {
        const newsStore = new NewsStore(new RootStore());
        newsStore.isInitialized = true;
        await newsStore.loadNews();
        expect(newsStore.isInitialized).toBe(true);
      });
    });
  });

  describe('findNewsArticle() instance method', () => {
    it('should find news by string id', async () => {
      const newsStore = new NewsStore(new RootStore());
      await newsStore.loadNews();
      const foundNewsArticle = newsStore.findNewsArticle(mockNewsArticle.id);
      expect(JSON.stringify(foundNewsArticle)).toBe(
        JSON.stringify(mockNewsArticle),
      );
    });
  });

  describe('createNewsArticle() instance method', () => {
    it('should call API createNewsArticle() method', async () => {
      const newsStore = new NewsStore(new RootStore());
      await newsStore.createNewsArticle(mockNewsArticleFields);
      expect(spiedOnApiCreateNewsArticle).toHaveBeenCalledWith(
        mockNewsArticleFields,
      );
    });

    describe('given API request resolves successfully', () => {
      it('should append the newly constructed news instance to news field array', async () => {
        const newsStore = new NewsStore(new RootStore());
        const newArticle = await newsStore.createNewsArticle(
          mockNewsArticleFields,
        );
        expect(newsStore.news).toContain(newArticle);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const newsStore = new NewsStore(rootStore);

        await newsStore.createNewsArticle(mockNewsArticleFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiCreateNewsArticle.mockRejectedValue(appError);
      });

      it('should not add any elements to the news array', async () => {
        const newsStore = new NewsStore(new RootStore());
        await newsStore.createNewsArticle(mockNewsArticleFields);
        expect(newsStore.news.length).toBe(0);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const newsStore = new NewsStore(rootStore);

        await newsStore.createNewsArticle(mockNewsArticleFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('onNewsArticleDeleted() instance method', () => {
    it('should remove the deleted news instance from news field array', async () => {
      const newsStore = new NewsStore(new RootStore());
      const newArticle = await newsStore.createNewsArticle(
        mockNewsArticleFields,
      );
      expect(newArticle).not.toBeUndefined();
      newsStore.onNewsArticleDeleted(newArticle!);
      expect(newsStore.news).not.toContain(newArticle);
    });

    it('should push a success alert up to the root store', async () => {
      const rootStore = new RootStore();
      const spiedOnRootStoreOnAlert = jest.fn();
      const newsStore = new NewsStore(rootStore);
      const newArticle = await newsStore.createNewsArticle(
        mockNewsArticleFields,
      );
      rootStore.onAlert = spiedOnRootStoreOnAlert;

      newsStore.onNewsArticleDeleted(newArticle!);

      expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
      expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
        AlertSeverity.Success,
      );
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize only the news field', () => {
      const newsStore = new NewsStore(new RootStore());
      expect(JSON.stringify(newsStore)).toBe(
        JSON.stringify({
          news: [],
        }),
      );
    });
  });
});

describe('News', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const newsArticle = new News(
        mockNewsArticleData,
        new NewsStore(new RootStore()),
      );
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
      const newsStore = new NewsStore(new RootStore());
      const newsArticle = new News(mockNewsArticleData, newsStore);

      expect(newsArticle.newsStore).toBe(newsStore);
      expect(newsArticle.id).toBe(mockNewsArticleData.id);
      expect(newsArticle.publicationDate).toBe(
        mockNewsArticleData.publicationDate,
      );
      expect(newsArticle.title).toBe(mockNewsArticleData.title);
      expect(newsArticle.text).toBe(mockNewsArticleData.text);
      expect(newsArticle.image).toBe(mockNewsArticleData.image);
      expect(newsArticle.onError).toBeTruthy();
    });
  });

  describe('update() instance method', () => {
    it('should call API updateNewsArticle() function', async () => {
      const newsArticle = new News(
        mockNewsArticleData,
        new NewsStore(new RootStore()),
      );
      await newsArticle.update(mockUpdatedNewsArticleFields);
      expect(spiedOnApiUpdateNewsArticle).toHaveBeenCalledWith(
        newsArticle.id,
        mockUpdatedNewsArticleFields,
      );
    });

    describe('given API request resolves successfully', () => {
      it('should update news instance fields', async () => {
        const newsArticle = new News(
          mockNewsArticleData,
          new NewsStore(new RootStore()),
        );
        await newsArticle.update(mockUpdatedNewsArticleFields);
        expect(newsArticle.title).toBe(mockUpdatedNewsArticleFields.title);
        expect(newsArticle.text).toBe(mockUpdatedNewsArticleFields.text);
        expect(newsArticle.image).toBe(mockUpdatedNewsArticleFields.image);
      });

      it('should push a success alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const newsArticle = new News(mockNewsArticleData, rootStore.newsStore);

        await newsArticle.update(mockUpdatedNewsArticleFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Success,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiUpdateNewsArticle.mockRejectedValue(appError);
      });

      it('should leave news instance data untouched', async () => {
        const newsArticle = new News(
          mockNewsArticleData,
          new NewsStore(new RootStore()),
        );

        const originalTitle = newsArticle.title;
        const originalText = newsArticle.text;
        const originalImage = newsArticle.image;

        await newsArticle.update(mockUpdatedNewsArticleFields);

        expect(newsArticle.title).toBe(originalTitle);
        expect(newsArticle.text).toBe(originalText);
        expect(newsArticle.image).toBe(originalImage);
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const newsArticle = new News(mockNewsArticleData, rootStore.newsStore);

        await newsArticle.update(mockUpdatedNewsArticleFields);

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('delete() instance method', () => {
    it('should call API deleteNewsArticle() function', async () => {
      const newsArticle = new News(
        mockNewsArticleData,
        new NewsStore(new RootStore()),
      );
      await newsArticle.delete();
      expect(spiedOnApiDeleteNewsArticle).toHaveBeenCalledWith(newsArticle.id);
    });

    describe('given API request resolves successfully', () => {
      it("should call the news store's onNewsArticleDeleted() method", async () => {
        const spiedOnNewsStoreOnNewsArticleDeleted = jest.spyOn(
          NewsStore.prototype,
          'onNewsArticleDeleted',
        );
        const newsArticle = new News(
          mockNewsArticleData,
          new NewsStore(new RootStore()),
        );
        await newsArticle.delete();

        expect(spiedOnNewsStoreOnNewsArticleDeleted).toHaveBeenCalledWith(
          newsArticle,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      beforeEach(() => {
        spiedOnApiDeleteNewsArticle.mockRejectedValue(appError);
      });

      it("should not call the news store's onNewsArticleDeleted() method", async () => {
        const spiedOnNewsStoreOnNewsArticleDeleted = jest.spyOn(
          NewsStore.prototype,
          'onNewsArticleDeleted',
        );

        const newsArticle = new News(
          mockNewsArticleData,
          new NewsStore(new RootStore()),
        );
        await newsArticle.delete();

        expect(spiedOnNewsStoreOnNewsArticleDeleted).not.toHaveBeenCalled();
      });

      it('should push an error alert up to the root store', async () => {
        const rootStore = new RootStore();
        const spiedOnRootStoreOnAlert = jest.fn();
        rootStore.onAlert = spiedOnRootStoreOnAlert;
        const newsArticle = new News(mockNewsArticleData, rootStore.newsStore);

        await newsArticle.delete();

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize to IUser', () => {
      const newsArticle = new News(
        mockNewsArticleData,
        new NewsStore(new RootStore()),
      );
      expect(JSON.stringify(newsArticle)).toBe(
        JSON.stringify(mockNewsArticleData),
      );
    });
  });
});
