/* eslint-disable jest/no-conditional-expect */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getStaticFile } from 'api';
import { mockImage, mockImageWithUrl } from 'model/__fakes__';
import { apiUrl, RestResolver } from 'utils';
import * as FileUtils from 'utils/file';

// Mock getFileWithUrl
const mockGetFileWithUrl = jest.spyOn(FileUtils, 'getFileWithUrl');

const mockStaticFileGetSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.body(mockImage));
};

const mockStaticFileGetError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(404));
};

const spiedOnStaticFileGetHandler = jest.fn();

const server = setupServer(
  rest.get(apiUrl('/image.jpeg'), spiedOnStaticFileGetHandler),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

beforeEach(() => {
  spiedOnStaticFileGetHandler.mockImplementation(mockStaticFileGetSuccess);
  mockGetFileWithUrl.mockReturnValue(mockImageWithUrl);
});

afterEach(() => {
  server.resetHandlers();
  jest.resetAllMocks();
});

describe('Static file API service', () => {
  describe('getStaticFile function', () => {
    describe('given the file was found', () => {
      it('should return file with url', async () => {
        const foundUser = await getStaticFile('image.jpeg');
        expect(spiedOnStaticFileGetHandler).toHaveBeenCalled();
        expect(foundUser).toEqual(mockImageWithUrl);
      });
    });

    describe('given no file was found', () => {
      it('should reject with a 404 error', async () => {
        spiedOnStaticFileGetHandler.mockReturnValue(mockStaticFileGetError);

        expect.assertions(2);
        try {
          await getStaticFile('image.jpeg');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnStaticFileGetHandler).toHaveBeenCalled();
        }
      });
    });
  });
});
