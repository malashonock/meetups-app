/* eslint-disable jest/no-conditional-expect */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { checkLogin, login, logout } from 'api';
import { mockIFullUser, mockUserData } from 'model/__fakes__';
import { apiUrl, RestResolver } from 'utils';
import { Credentials } from 'model';

const mockLoginGetSuccess: RestResolver = (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      user: mockUserData,
    }),
  );
};

const mockLoginGetError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(401));
};

const mockLoginPostSuccess: RestResolver = (req, res, ctx) => {
  return res(
    ctx.status(201),
    ctx.json({
      user: mockIFullUser,
    }),
  );
};

const mockLoginPostError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(401));
};

const mockLogoutSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json({}));
};

const spiedOnLoginGetHandler = jest.fn();
const spiedOnLoginPostHandler = jest.fn();
const spiedOnLogoutGetHandler = jest.fn();

const server = setupServer(
  rest.get(apiUrl('/login'), spiedOnLoginGetHandler),
  rest.post(apiUrl('/login'), spiedOnLoginPostHandler),
  rest.get(apiUrl('/logout'), spiedOnLogoutGetHandler),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

beforeEach(() => {
  spiedOnLoginGetHandler.mockImplementation(mockLoginGetSuccess);
  spiedOnLoginPostHandler.mockImplementation(mockLoginPostSuccess);
  spiedOnLogoutGetHandler.mockImplementation(mockLogoutSuccess);
});

afterEach(() => {
  server.resetHandlers();
  jest.resetAllMocks();
});

describe('Login API service', () => {
  describe('login function', () => {
    describe('given correct credentials', () => {
      it('should return full info about the logged in user', async () => {
        const validCredentials: Credentials = {
          username: mockIFullUser.name,
          password: mockIFullUser.password,
        };
        const fullUserData = await login(validCredentials);
        expect(spiedOnLoginPostHandler).toHaveBeenCalled();
        expect(fullUserData).toEqual(mockIFullUser);
      });
    });

    describe('given incorrect credentials', () => {
      it('should reject with a 401 error', async () => {
        spiedOnLoginPostHandler.mockImplementation(mockLoginPostError);

        expect.assertions(2);
        try {
          await login({
            username: mockIFullUser.surname,
            password: 'wrong password',
          });
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnLoginPostHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('checkLogin function', () => {
    describe('given a user is logged in', () => {
      it('should return full info about the logged in user', async () => {
        const userData = await checkLogin();
        expect(spiedOnLoginGetHandler).toHaveBeenCalled();
        expect(userData).toEqual(mockUserData);
      });
    });

    describe('given no user is logged in', () => {
      it('should reject with a 401 error', async () => {
        spiedOnLoginGetHandler.mockImplementation(mockLoginGetError);

        expect.assertions(2);
        try {
          await checkLogin();
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnLoginGetHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('logout function', () => {
    it('should always resolve', async () => {
      await logout();
      expect(spiedOnLogoutGetHandler).toHaveBeenCalled();
    });
  });
});
