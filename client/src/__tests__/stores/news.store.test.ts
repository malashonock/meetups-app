import * as MobX from 'mobx';

import { NewsStore, RootStore, News } from 'stores';
import * as NewsApi from 'api/services/news.service';
import {
  mockNews,
  mockNewsArticle,
  mockNewsArticleData,
  mockNewsArticleFields,
  mockNewsData,
} from 'model/__fakes__';

const spiedOnMobXMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');
const spiedOnApiGetNews = jest.spyOn(NewsApi, 'getNews');
const spiedOnApiCreateNewsArticle = jest.spyOn(NewsApi, 'createNewsArticle');

beforeEach(() => {
  spiedOnApiGetNews.mockReturnValue(Promise.resolve(mockNewsData));
  spiedOnApiCreateNewsArticle.mockReturnValue(
    Promise.resolve(mockNewsArticleData),
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

    it('should initialize news field to an empty array', () => {
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
    it('should find user by string id', async () => {
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
