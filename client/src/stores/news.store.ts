import { action, makeObservable, observable, runInAction } from 'mobx';
import i18n from 'i18n';

import * as API from 'api';
import {
  Alert,
  AlertSeverity,
  FileWithUrl,
  Loadable,
  Nullable,
  Optional,
} from 'types';
import { AppError, INews, NewsFields } from 'model';
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

    this.onError = (error: AppError): void => {
      const { problem, hint } = error;
      this.rootStore.onAlert({
        severity: AlertSeverity.Error,
        title: problem,
        text: hint,
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

      this.rootStore.onAlert(
        new Alert(
          {
            severity: AlertSeverity.Success,
            text: i18n.t('alerts.news.created'),
          },
          this.rootStore.uiStore,
        ),
      );

      return newArticle;
    });
  }

  onNewsArticleDeleted(deletedArticle: News): void {
    this.news.splice(this.news.indexOf(deletedArticle), 1);

    this.rootStore.onAlert(
      new Alert(
        {
          severity: AlertSeverity.Success,
          text: i18n.t('alerts.news.deleted'),
        },
        this.rootStore.uiStore,
      ),
    );
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

    this.onError = (error: AppError): void => {
      if (this.newsStore?.onError) {
        this.newsStore.onError(error);
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

    this.newsStore?.rootStore.onAlert(
      new Alert(
        {
          severity: AlertSeverity.Success,
          text: i18n.t('alerts.news.updated'),
        },
        this.newsStore.rootStore.uiStore,
      ),
    );
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
