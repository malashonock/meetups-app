import * as MobX from 'mobx';

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
import { AxiosError } from 'axios';

const spiedOnMobXMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');
const spiedOnApiGetNews = jest.spyOn(NewsApi, 'getNews');
const spiedOnApiCreateNewsArticle = jest.spyOn(NewsApi, 'createNewsArticle');
const spiedOnApiUpdateNewsArticle = jest.spyOn(NewsApi, 'updateNewsArticle');
const spiedOnApiDeleteNewsArticle = jest.spyOn(NewsApi, 'deleteNewsArticle');

beforeEach(() => {
  spiedOnApiGetNews.mockReturnValue(Promise.resolve(mockNewsData));
  spiedOnApiCreateNewsArticle.mockReturnValue(
    Promise.resolve(mockNewsArticleData),
  );
  spiedOnApiUpdateNewsArticle.mockReturnValue(
    Promise.resolve(mockUpdatedNewsArticleData),
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('NewsStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const newsStore = new NewsStore(new RootStore());
      expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(newsStore);
    });

    it('should initialize instance fields properly', () => {
      const newsStore = new NewsStore(new RootStore());

      expect(newsStore.isLoading).toBe(false);
      expect(newsStore.isError).toBe(false);
      expect(newsStore.errors.length).toBe(0);

      expect(newsStore.news.length).toBe(0);
    });
  });

  describe('loadNews() instance method', () => {
    it('should call API getNews() method', async () => {
      const newsStore = new NewsStore(new RootStore());
      await newsStore.loadNews();
      expect(spiedOnApiGetNews).toHaveBeenCalled();
    });

    it('should be in isLoading state while API is running the request', async () => {
      const newsStore = new NewsStore(new RootStore());
      const loadNewsTask = newsStore.loadNews();
      expect(newsStore.isLoading).toBe(true);
      await loadNewsTask;
      expect(newsStore.isLoading).toBe(false);
    });

    describe('given API request resolves successfully', () => {
      it('should populate news field with fetched news', async () => {
        const newsStore = new NewsStore(new RootStore());
        await newsStore.loadNews();

        expect(newsStore.isLoading).toBe(false);
        expect(newsStore.isError).toBe(false);
        expect(newsStore.errors.length).toBe(0);

        expect(newsStore.news.length).toBe(mockNews.length);
        expect(JSON.stringify(newsStore.news)).toBe(JSON.stringify(mockNews));
      });
    });

    describe('given API request rejects with an error', () => {
      const ERROR_CODE = '404';
      const ERROR_MESSAGE = 'Resource not found';

      beforeEach(() => {
        spiedOnApiGetNews.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('should populate errors field with the caught error', async () => {
        const newsStore = new NewsStore(new RootStore());

        await newsStore.loadNews();

        expect(newsStore.isLoading).toBe(false);
        expect(newsStore.isError).toBe(true);
        expect(newsStore.errors.length).toBe(1);
        expect((newsStore.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((newsStore.errors[0] as AxiosError).message).toBe(ERROR_MESSAGE);
      });

      it('should not add any elements to the news array', async () => {
        const newsStore = new NewsStore(new RootStore());
        await newsStore.loadNews();
        expect(newsStore.news.length).toBe(0);
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

    it('should be in isLoading state while API is running the request', async () => {
      const newsStore = new NewsStore(new RootStore());
      const createNewsArticleTask = newsStore.createNewsArticle(
        mockNewsArticleFields,
      );
      expect(newsStore.isLoading).toBe(true);
      await createNewsArticleTask;
      expect(newsStore.isLoading).toBe(false);
    });

    describe('given API request resolves successfully', () => {
      it('should append the newly constructed news instance to news field array', async () => {
        const newsStore = new NewsStore(new RootStore());
        const newArticle = await newsStore.createNewsArticle(
          mockNewsArticleFields,
        );
        expect(newsStore.news).toContain(newArticle);
      });
    });

    describe('given API request rejects with an error', () => {
      const ERROR_CODE = '404';
      const ERROR_MESSAGE = 'Resource not found';

      beforeEach(() => {
        spiedOnApiCreateNewsArticle.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('should populate errors field with the caught error', async () => {
        const newsStore = new NewsStore(new RootStore());

        await newsStore.createNewsArticle(mockNewsArticleFields);

        expect(newsStore.isLoading).toBe(false);
        expect(newsStore.isError).toBe(true);
        expect(newsStore.errors.length).toBe(1);
        expect((newsStore.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((newsStore.errors[0] as AxiosError).message).toBe(ERROR_MESSAGE);
      });

      it('should not add any elements to the news array', async () => {
        const newsStore = new NewsStore(new RootStore());
        await newsStore.createNewsArticle(mockNewsArticleFields);
        expect(newsStore.news.length).toBe(0);
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
    describe('given news store is passed', () => {
      it('should make the returned instance observable', () => {
        const newsStore = new NewsStore(new RootStore());
        const newsArticle = new News(mockNewsArticleData, newsStore);
        expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(newsArticle);
      });
    });

    describe('given news store is not passed', () => {
      it('should not make the returned instance observable', () => {
        const newsArticle = new News(mockNewsArticleData);
        expect(spiedOnMobXMakeAutoObservable).not.toHaveBeenCalled();
      });
    });

    it('should initialize instance fields properly', () => {
      const newsArticle = new News(mockNewsArticleData);

      expect(newsArticle.newsStore).toBeNull();
      expect(newsArticle.isLoading).toBe(false);
      expect(newsArticle.isError).toBe(false);
      expect(newsArticle.errors.length).toBe(0);

      expect(newsArticle.id).toBe(mockNewsArticleData.id);
      expect(newsArticle.publicationDate).toBe(
        mockNewsArticleData.publicationDate,
      );
      expect(newsArticle.title).toBe(mockNewsArticleData.title);
      expect(newsArticle.text).toBe(mockNewsArticleData.text);
      expect(newsArticle.image).toBe(mockNewsArticleData.image);
    });
  });

  describe('update() instance method', () => {
    it('should call API updateNewsArticle() function', async () => {
      const newsArticle = new News(mockNewsArticleData);
      await newsArticle.update(mockUpdatedNewsArticleFields);
      expect(spiedOnApiUpdateNewsArticle).toHaveBeenCalledWith(
        newsArticle.id,
        mockUpdatedNewsArticleFields,
      );
    });

    it('should be in isLoading state while API is running the request', async () => {
      const newsArticle = new News(mockNewsArticleData);
      const updateNewsArticleTask = newsArticle.update(
        mockUpdatedNewsArticleFields,
      );
      expect(newsArticle.isLoading).toBe(true);
      await updateNewsArticleTask;
      expect(newsArticle.isLoading).toBe(false);
    });

    describe('given API request resolves successfully', () => {
      it('should update news instance fields', async () => {
        const newsArticle = new News(mockNewsArticleData);
        await newsArticle.update(mockUpdatedNewsArticleFields);

        expect(newsArticle.isLoading).toBe(false);
        expect(newsArticle.isError).toBe(false);
        expect(newsArticle.errors.length).toBe(0);

        expect(newsArticle.title).toBe(mockUpdatedNewsArticleFields.title);
        expect(newsArticle.text).toBe(mockUpdatedNewsArticleFields.text);
        expect(newsArticle.image).toBe(mockUpdatedNewsArticleFields.image);
      });
    });

    describe('given API request rejects with an error', () => {
      const ERROR_CODE = '500';
      const ERROR_MESSAGE = 'Internal server error';

      beforeEach(() => {
        spiedOnApiUpdateNewsArticle.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('populate errors field with the caught error', async () => {
        const newsArticle = new News(mockNewsArticleData);

        await newsArticle.update(mockUpdatedNewsArticleFields);

        expect(newsArticle.isLoading).toBe(false);
        expect(newsArticle.isError).toBe(true);
        expect(newsArticle.errors.length).toBe(1);
        expect((newsArticle.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((newsArticle.errors[0] as AxiosError).message).toBe(
          ERROR_MESSAGE,
        );
      });

      it('should leave news instance data untouched', async () => {
        const newsArticle = new News(mockNewsArticleData);

        const originalTitle = newsArticle.title;
        const originalText = newsArticle.text;
        const originalImage = newsArticle.image;

        await newsArticle.update(mockUpdatedNewsArticleFields);

        expect(newsArticle.title).toBe(originalTitle);
        expect(newsArticle.text).toBe(originalText);
        expect(newsArticle.image).toBe(originalImage);
      });
    });
  });

  describe('delete() instance method', () => {
    it('should call API deleteNewsArticle() function', async () => {
      const newsArticle = new News(mockNewsArticleData);
      await newsArticle.delete();
      expect(spiedOnApiDeleteNewsArticle).toHaveBeenCalledWith(newsArticle.id);
    });

    it('should be in isLoading state while API is running the request', async () => {
      const newsArticle = new News(mockNewsArticleData);
      const deleteNewsArticleTask = newsArticle.delete();
      expect(newsArticle.isLoading).toBe(true);
      await deleteNewsArticleTask;
      expect(newsArticle.isLoading).toBe(false);
    });

    describe('given API request resolves successfully', () => {
      it('given a news store, should call its onNewsArticleDeleted() method', async () => {
        const spiedOnNewsStoreOnNewsArticleDeleted = jest.spyOn(
          NewsStore.prototype,
          'onNewsArticleDeleted',
        );
        const newsArticle = new News(
          mockNewsArticleData,
          new NewsStore(new RootStore()),
        );
        await newsArticle.delete();

        expect(newsArticle.isLoading).toBe(false);
        expect(newsArticle.isError).toBe(false);
        expect(newsArticle.errors.length).toBe(0);

        expect(spiedOnNewsStoreOnNewsArticleDeleted).toHaveBeenCalledWith(
          newsArticle,
        );
      });
    });

    describe('given API request rejects with an error', () => {
      const ERROR_CODE = '403';
      const ERROR_MESSAGE = 'Forbidden';

      beforeEach(() => {
        spiedOnApiDeleteNewsArticle.mockImplementation(() => {
          throw new AxiosError(ERROR_MESSAGE, ERROR_CODE);
        });
      });

      it('should populate errors field with the caught error', async () => {
        const newsArticle = new News(
          mockNewsArticleData,
          new NewsStore(new RootStore()),
        );
        await newsArticle.delete();

        expect(newsArticle.isLoading).toBe(false);
        expect(newsArticle.isError).toBe(true);
        expect(newsArticle.errors.length).toBe(1);
        expect((newsArticle.errors[0] as AxiosError).code).toBe(ERROR_CODE);
        expect((newsArticle.errors[0] as AxiosError).message).toBe(
          ERROR_MESSAGE,
        );
      });

      it('given a news store, should not call its onNewsArticleDeleted() method', async () => {
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
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize to IUser', () => {
      const newsArticle = new News(mockNewsArticleData);
      expect(JSON.stringify(newsArticle)).toBe(
        JSON.stringify(mockNewsArticleData),
      );
    });
  });
});
