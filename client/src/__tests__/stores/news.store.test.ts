import * as MobX from 'mobx';

import { NewsStore, RootStore, News } from 'stores';
import * as NewsApi from 'api/services/news.service';
import {
  mockNewsData,
  mockNews,
  mockNewsArticle,
  mockNewsArticleData,
  mockNewsArticleFields,
  mockImageWithUrl2,
} from 'model/__fakes__';
import { INews, NewsFields } from 'model';

const spiedOnMobXMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');
const spiedOnApiGetNews = jest.spyOn(NewsApi, 'getNews');
const spiedOnApiCreateNewsArticle = jest.spyOn(NewsApi, 'createNewsArticle');
const spiedOnApiUpdateNewsArticle = jest.spyOn(NewsApi, 'updateNewsArticle');
const spiedOnApiDeleteNewsArticle = jest.spyOn(NewsApi, 'deleteNewsArticle');

const updatedNewsArticleFields: Partial<NewsFields> = {
  title: 'Updated news title',
  text: 'Updated news text',
  image: mockImageWithUrl2,
};

const updatedNewsArticleData: INews = {
  ...mockNewsArticleData,
  ...updatedNewsArticleFields,
};

beforeEach(() => {
  spiedOnApiGetNews.mockReturnValue(Promise.resolve(mockNewsData));
  spiedOnApiCreateNewsArticle.mockReturnValue(
    Promise.resolve(mockNewsArticleData),
  );
  spiedOnApiUpdateNewsArticle.mockReturnValue(
    Promise.resolve(updatedNewsArticleData),
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

    it('should initialize newsArticle field to an empty array', () => {
      const newsStore = new NewsStore(new RootStore());
      expect(newsStore.news.length).toBe(0);
    });
  });

  describe('loadNews() instance method', () => {
    it('should call API getNews() method', async () => {
      const newsStore = new NewsStore(new RootStore());
      await newsStore.loadNews();
      expect(spiedOnApiGetNews).toHaveBeenCalled();
    });

    it('should populate news field with fetched news', async () => {
      const newsStore = new NewsStore(new RootStore());
      await newsStore.loadNews();
      expect(newsStore.news.length).toBe(mockNews.length);
      expect(JSON.stringify(newsStore.news)).toBe(JSON.stringify(mockNews));
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

    it('should append the newly constructed news instance to news field array', async () => {
      const newsStore = new NewsStore(new RootStore());
      const newArticle = await newsStore.createNewsArticle(
        mockNewsArticleFields,
      );
      expect(newsStore.news).toContain(newArticle);
    });
  });

  describe('onNewsArticleDeleted() instance method', () => {
    it('should remove the deleted news instance from news field array', async () => {
      const newsStore = new NewsStore(new RootStore());
      const newArticle = await newsStore.createNewsArticle(
        mockNewsArticleFields,
      );
      newsStore.onNewsArticleDeleted(newArticle);
      expect(newsStore.news).not.toContain(newArticle);
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

    it('should initialize news fields with news data', () => {
      const newsArticle = new News(mockNewsArticleData);
      expect(newsArticle.newsStore).toBeNull();
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
      await newsArticle.update(updatedNewsArticleFields);
      expect(spiedOnApiUpdateNewsArticle).toHaveBeenCalledWith(
        newsArticle.id,
        updatedNewsArticleFields,
      );
    });

    it('should update news instance fields', async () => {
      const newsArticle = new News(mockNewsArticleData);
      await newsArticle.update(updatedNewsArticleFields);
      expect(newsArticle.title).toBe(updatedNewsArticleFields.title);
      expect(newsArticle.text).toBe(updatedNewsArticleFields.text);
      expect(newsArticle.image).toBe(updatedNewsArticleFields.image);
    });
  });

  describe('delete() instance method', () => {
    it('should call API deleteNewsArticle() function', async () => {
      const newsArticle = new News(mockNewsArticleData);
      await newsArticle.delete();
      expect(spiedOnApiDeleteNewsArticle).toHaveBeenCalledWith(newsArticle.id);
    });

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
      expect(spiedOnNewsStoreOnNewsArticleDeleted).toHaveBeenCalledWith(
        newsArticle,
      );
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
