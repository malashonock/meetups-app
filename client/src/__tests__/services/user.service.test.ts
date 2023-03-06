/* eslint-disable jest/no-conditional-expect */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getUser, getUsers } from 'api';
import { mockFullUser, mockFullUsers } from 'model/__fakes__';
import { apiUrl, RestResolver } from 'utils';

const mockUsersGetSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockFullUsers));
};

const mockUserGetHandler: RestResolver = (req, res, ctx) => {
  return req.params.id === mockFullUser.id
    ? res(ctx.status(200), ctx.json(mockFullUser))
    : res(ctx.status(404));
};

const spiedOnUsersGetHandler = jest.fn();
const spiedOnUserGetHandler = jest.fn();

const server = setupServer(
  rest.get(apiUrl('/users'), spiedOnUsersGetHandler),
  rest.get(apiUrl('/users/:id'), spiedOnUserGetHandler),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

beforeEach(() => {
  spiedOnUsersGetHandler.mockImplementation(mockUsersGetSuccess);
  spiedOnUserGetHandler.mockImplementation(mockUserGetHandler);
});

afterEach(() => {
  server.resetHandlers();
  jest.resetAllMocks();
});

describe('User API service', () => {
  describe('getUsers function', () => {
    it('should return an array of users with full info', async () => {
      const fullUsers = await getUsers();
      expect(spiedOnUsersGetHandler).toHaveBeenCalled();
      expect(fullUsers).toEqual(mockFullUsers);
    });
  });

  describe('getUser function', () => {
    describe('given the user was found', () => {
      it('should return full info about the user with the specified id', async () => {
        const foundUser = await getUser(mockFullUser.id);
        expect(spiedOnUserGetHandler).toHaveBeenCalled();
        expect(foundUser).toEqual(mockFullUser);
      });
    });

    describe('given no user was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await getUser('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnUserGetHandler).toHaveBeenCalled();
        }
      });
    });
  });
});
