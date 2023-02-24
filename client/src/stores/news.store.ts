import { makeAutoObservable, runInAction } from 'mobx';

import * as API from 'api';
import { FileWithUrl, ILoadable, Nullable, Optional } from 'types';
import { INews, NewsFields } from 'model';

export class NewsStore implements ILoadable {
  news: News[];

  isLoading: boolean;
  isError: boolean;
  errors: unknown[];

  constructor() {
    makeAutoObservable(this);

    this.news = [];

    this.isLoading = false;
    this.isError = false;
    this.errors = [];
  }

  async loadNews(): Promise<void> {
    try {
      this.isLoading = true;

      const newsData: INews[] = await API.getNews();
      runInAction(() => {
        this.news = newsData.map(
          (newsArticleData: INews): News => new News(newsArticleData, this),
        );

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

  async createNewsArticle(
    newsArticleData: NewsFields,
  ): Promise<Optional<News>> {
    try {
      this.isLoading = true;

      const newArticleData = await API.createNewsArticle(newsArticleData);
      const newArticle = new News(newArticleData, this);

      runInAction(() => {
        this.news.push(newArticle);
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;

      return newArticle;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  onNewsArticleDeleted(deletedArticle: News): void {
    this.news.splice(this.news.indexOf(deletedArticle), 1);
  }

  findNewsArticle(id: string): Optional<News> {
    return this.news.find((newsArticle: News) => newsArticle.id === id);
  }

  toJSON() {
    return {
      news: this.news,
    };
  }
}

export class News implements INews, ILoadable {
  newsStore: Nullable<NewsStore> = null;
  isLoading: boolean;
  isError: boolean;
  errors: unknown[];

  id: string;
  publicationDate: Date;
  title: string;
  text: string;
  image: Nullable<FileWithUrl>;

  constructor(newsArticleData: INews, newsStore?: NewsStore) {
    if (newsStore) {
      makeAutoObservable(this);
      this.newsStore = newsStore;
    }

    ({
      id: this.id,
      publicationDate: this.publicationDate,
      title: this.title,
      text: this.text,
      image: this.image,
    } = newsArticleData);

    this.isLoading = false;
    this.isError = false;
    this.errors = [];
  }

  async update(newsArticleData: Partial<NewsFields>): Promise<void> {
    try {
      this.isLoading = true;

      const updatedNewsData = await API.updateNewsArticle(
        this.id,
        newsArticleData,
      );
      runInAction(() => {
        Object.assign(this, updatedNewsData);
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

      await API.deleteNewsArticle(this.id);
      runInAction(() => {
        this.newsStore?.onNewsArticleDeleted(this);
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

  toJSON(): INews {
    return {
      id: this.id,
      publicationDate: this.publicationDate,
      title: this.title,
      text: this.text,
      image: this.image,
    };
  }
}
