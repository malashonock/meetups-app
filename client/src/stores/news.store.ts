import { makeAutoObservable, runInAction } from 'mobx';

import * as API from 'api';
import { RootStore } from 'stores';
import { FileWithUrl, Nullable, Optional } from 'types';
import { INews, NewsFields } from 'model';

export class NewsStore {
  news: News[];

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);
    this.news = [];
  }

  async loadNews(): Promise<void> {
    const newsData: INews[] = await API.getNews();
    runInAction(() => {
      this.news = newsData.map(
        (newsArticleData: INews): News => new News(newsArticleData, this),
      );
    });
  }

  async createNewsArticle(newsArticleData: NewsFields): Promise<News> {
    const newArticleData = await API.createNewsArticle(newsArticleData);
    const newArticle = new News(newArticleData, this);

    runInAction(() => {
      this.news.push(newArticle);
    });

    return newArticle;
  }

  onNewsArticleDeleted(deletedArticle: News): void {
    this.news.splice(this.news.indexOf(deletedArticle), 1);
  }

  findNewsArticle(id: string): Optional<News> {
    return this.news.find((newsArticle: News) => newsArticle.id === id);
  }
}

export class News implements INews {
  newsStore: Nullable<NewsStore> = null;

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
  }

  async update(newsArticleData: Partial<NewsFields>): Promise<void> {
    const updatedNewsData = await API.updateNewsArticle(
      this.id,
      newsArticleData,
    );
    runInAction(() => {
      Object.assign(this, updatedNewsData);
    });
  }

  async delete(): Promise<void> {
    await API.deleteNewsArticle(this.id);
    runInAction(() => {
      this.newsStore?.onNewsArticleDeleted(this);
    });
  }
}
