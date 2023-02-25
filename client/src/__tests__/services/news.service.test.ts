/* eslint-disable jest/no-conditional-expect */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  getNewsArticle,
  getNews,
  updateNewsArticle,
  createNewsArticle,
  deleteNewsArticle,
} from 'api';
import * as StaticApi from 'api/services/static.service';
import {
  mockNewsArticleData,
  mockNewsArticle,
  mockNewsArticleDto,
  mockNewsData,
  mockNewsDto,
  mockImagesWithUrl,
  mockUpdatedNewsArticleFields,
  mockUpdatedNewsArticleDto,
  mockUpdatedNewsArticle,
  mockUpdatedNewsArticleData,
  mockNewsArticleFields,
} from 'model/__fakes__';
import { apiUrl, RestResolver } from 'utils';
import { FileWithUrl } from 'types';

// Mock getNewsFromJson
const mockGetStaticFile = jest.spyOn(StaticApi, 'getStaticFile');

const mockNewsGetSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockNewsDto));
};

const mockUserGetHandler: RestResolver = (req, res, ctx) => {
  return req.params.id === mockNewsArticle.id
    ? res(ctx.status(200), ctx.json(mockNewsArticleDto))
    : res(ctx.status(404));
};

const mockNewsArticlePostSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(201), ctx.json(mockNewsArticleDto));
};

const mockNewsArticlePatchSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockUpdatedNewsArticleDto));
};

const mockNewsArticleDeleteSuccess: RestResolver = (req, res, ctx) => {
  return req.params.id === mockNewsArticle.id
    ? res(ctx.status(200))
    : res(ctx.status(404));
};

const mockInternalServerError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(500));
};

const mockUnauthorizedError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(401));
};

const spiedOnNewsGetHandler = jest.fn();
const spiedOnNewsArticleGetHandler = jest.fn();
const spiedOnNewsArticlePostHandler = jest.fn();
const spiedOnNewsArticlePatchHandler = jest.fn();
const spiedOnNewsArticleDeleteHandler = jest.fn();

const server = setupServer(
  rest.get(apiUrl('/news'), spiedOnNewsGetHandler),
  rest.get(apiUrl('/news/:id'), spiedOnNewsArticleGetHandler),
  rest.post(apiUrl('/news'), spiedOnNewsArticlePostHandler),
  rest.patch(apiUrl('/news/:id'), spiedOnNewsArticlePatchHandler),
  rest.delete(apiUrl('/news/:id'), spiedOnNewsArticleDeleteHandler),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

beforeEach(() => {
  mockGetStaticFile.mockImplementation(
    async (url: string): Promise<FileWithUrl> => {
      return mockImagesWithUrl.filter(
        (imageWithUrl: FileWithUrl): boolean => imageWithUrl.url === url,
      )[0];
    },
  );
  spiedOnNewsGetHandler.mockImplementation(mockNewsGetSuccess);
  spiedOnNewsArticleGetHandler.mockImplementation(mockUserGetHandler);
  spiedOnNewsArticlePostHandler.mockImplementation(mockNewsArticlePostSuccess);
  spiedOnNewsArticlePatchHandler.mockImplementation(
    mockNewsArticlePatchSuccess,
  );
  spiedOnNewsArticleDeleteHandler.mockImplementation(
    mockNewsArticleDeleteSuccess,
  );
});

afterEach(() => {
  server.resetHandlers();
  jest.resetAllMocks();
});

describe('News API service', () => {
  describe('getNews function', () => {
    it('should return an array of all news', async () => {
      const news = await getNews();
      expect(spiedOnNewsGetHandler).toHaveBeenCalled();
      expect(news).toEqual(mockNewsData);
    });
  });

  describe('getNewsArticle function', () => {
    describe('given the news article was found', () => {
      it('should return the news article with the specified id', async () => {
        const updatedArticle = await getNewsArticle(mockNewsArticle.id);
        expect(spiedOnNewsArticleGetHandler).toHaveBeenCalled();
        expect(updatedArticle).toEqual(mockNewsArticleData);
      });
    });

    describe('given no news article was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await getNewsArticle('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnNewsArticleGetHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('createNewsArticle function', () => {
    describe('given user is logged in & form fields are filled correctly', () => {
      it('should return the newly created article', async () => {
        const updatedArticle = await createNewsArticle(mockNewsArticleFields);
        expect(spiedOnNewsArticlePostHandler).toHaveBeenCalled();
        expect(updatedArticle).toEqual(mockNewsArticleData);
      });
    });

    describe('given user is not logged in', () => {
      it('should reject with a 401 error', async () => {
        spiedOnNewsArticlePostHandler.mockImplementation(mockUnauthorizedError);

        expect.assertions(2);
        try {
          await createNewsArticle(mockNewsArticleFields);
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnNewsArticlePostHandler).toHaveBeenCalled();
        }
      });
    });

    describe('given there are problems with the filled data', () => {
      it('should reject with a 500 error', async () => {
        spiedOnNewsArticlePostHandler.mockImplementation(
          mockInternalServerError,
        );

        expect.assertions(2);
        try {
          await createNewsArticle(mockNewsArticleFields);
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnNewsArticlePostHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('updateNewsArticle function', () => {
    describe('given user is logged in & form fields are filled correctly', () => {
      it('should return the updated news article', async () => {
        const updatedArticle = await updateNewsArticle(
          mockUpdatedNewsArticle.id,
          mockUpdatedNewsArticleFields,
        );
        expect(spiedOnNewsArticlePatchHandler).toHaveBeenCalled();
        expect(updatedArticle).toEqual(mockUpdatedNewsArticleData);
      });
    });

    describe('given user is not logged in', () => {
      it('should reject with a 401 error', async () => {
        spiedOnNewsArticlePatchHandler.mockImplementation(
          mockUnauthorizedError,
        );

        expect.assertions(2);
        try {
          await updateNewsArticle(
            mockUpdatedNewsArticle.id,
            mockUpdatedNewsArticleFields,
          );
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnNewsArticlePatchHandler).toHaveBeenCalled();
        }
      });
    });

    describe('given there are problems with the filled data', () => {
      it('should reject with a 500 error', async () => {
        spiedOnNewsArticlePatchHandler.mockImplementation(
          mockInternalServerError,
        );

        expect.assertions(2);
        try {
          await updateNewsArticle(
            mockUpdatedNewsArticle.id,
            mockUpdatedNewsArticleFields,
          );
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnNewsArticlePatchHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('deleteNewsArticle function', () => {
    describe('given the news article was found', () => {
      it('should delete the news article with the specified id', async () => {
        await deleteNewsArticle(mockNewsArticle.id);
        expect(spiedOnNewsArticleDeleteHandler).toHaveBeenCalled();
      });
    });

    describe('given no news article was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await deleteNewsArticle('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnNewsArticleDeleteHandler).toHaveBeenCalled();
        }
      });
    });
  });
});
