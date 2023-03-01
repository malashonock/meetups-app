import { action, makeObservable, observable, runInAction } from 'mobx';
import { AxiosError } from 'axios';

import * as API from 'api';
import {
  AlertSeverity,
  FileWithUrl,
  Loadable,
  LoadError,
  Nullable,
  Optional,
} from 'types';
import { INews, NewsFields } from 'model';
import { RootStore } from 'stores';

export class NewsStore extends Loadable {
  rootStore: RootStore;
  news: News[];
  isInitialized: boolean;

  constructor(rootStore: RootStore) {
    super();
    this.setupObservable();

    this.rootStore = rootStore;

    this.news = [];
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
      news: observable,
      isInitialized: observable,
      loadNews: action,
      createNewsArticle: action,
      onNewsArticleDeleted: action,
    });
  }

  async loadNews(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    await this.tryLoad(async () => {
      const newsData: INews[] = await API.getNews();
      runInAction(() => {
        this.news = newsData.map(
          (newsArticleData: INews): News => new News(newsArticleData, this),
        );

        this.isInitialized = true;
      });
    });
  }

  async createNewsArticle(
    newsArticleData: NewsFields,
  ): Promise<Optional<News>> {
    return await this.tryLoad(async () => {
      const newArticleData = await API.createNewsArticle(newsArticleData);
      const newArticle = new News(newArticleData, this);

      this.news.push(newArticle);

      return newArticle;
    });
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

export class News extends Loadable implements INews {
  newsStore: Nullable<NewsStore> = null;

  id: string;
  publicationDate: Date;
  title: string;
  text: string;
  image: Nullable<FileWithUrl>;

  constructor(newsArticleData: INews, newsStore?: NewsStore) {
    super();
    this.setupObservable();

    if (newsStore) {
      this.newsStore = newsStore;
    }

    ({
      id: this.id,
      publicationDate: this.publicationDate,
      title: this.title,
      text: this.text,
      image: this.image,
    } = newsArticleData);

    this.onLoadError = (error: LoadError): void => {
      if (this.newsStore?.onLoadError) {
        this.newsStore.onLoadError(error);
      }
    };
  }

  setupObservable(): void {
    makeObservable(this, {
      newsStore: observable,
      id: observable,
      publicationDate: observable,
      title: observable,
      text: observable,
      image: observable,
      update: action,
      delete: action,
    });
  }

  async update(newsArticleData: Partial<NewsFields>): Promise<void> {
    await this.tryLoad(async () => {
      const updatedNewsData = await API.updateNewsArticle(
        this.id,
        newsArticleData,
      );
      runInAction(() => {
        Object.assign(this, updatedNewsData);
      });
    });
  }

  async delete(): Promise<void> {
    await this.tryLoad(async () => {
      await API.deleteNewsArticle(this.id);
      runInAction(() => {
        this.newsStore?.onNewsArticleDeleted(this);
      });
    });
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
