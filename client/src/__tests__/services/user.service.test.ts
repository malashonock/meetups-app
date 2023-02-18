/* eslint-disable jest/no-conditional-expect */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getParticipants, getUser, getUsers, getVotedUsers } from 'api';
import {
  mockFullUser,
  mockFullUsers,
  mockMeetup,
  mockShortUsersData,
  mockUserData,
} from 'model/__fakes__';
import { apiUrl, RestResolver } from 'utils';
import { Credentials } from 'model';

const mockUsersGetSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockFullUsers));
};

const mockUserGetSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockFullUser));
};

const mockUserGetError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(404));
};

const mockRelatedUsersGet: RestResolver = (req, res, ctx) => {
  return req.params.id === mockMeetup.id
    ? res(ctx.status(200), ctx.json(mockShortUsersData))
    : res(ctx.status(404));
};

const spiedOnUsersGetHandler = jest.fn();
const spiedOnUserGetHandler = jest.fn();
const spiedOnVotedUsersGetHandler = jest.fn();
const spiedOnParticipantsGetHandler = jest.fn();

const server = setupServer(
  rest.get(apiUrl('/users'), spiedOnUsersGetHandler),
  rest.get(apiUrl('/users/:id'), spiedOnUserGetHandler),
  rest.get(apiUrl('/meetups/:id/votedusers'), spiedOnVotedUsersGetHandler),
  rest.get(apiUrl('/meetups/:id/participants'), spiedOnParticipantsGetHandler),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

beforeEach(() => {
  spiedOnUsersGetHandler.mockImplementation(mockUsersGetSuccess);
  spiedOnUserGetHandler.mockImplementation(mockUserGetSuccess);
  spiedOnVotedUsersGetHandler.mockImplementation(mockRelatedUsersGet);
  spiedOnParticipantsGetHandler.mockImplementation(mockRelatedUsersGet);
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
        spiedOnUserGetHandler.mockImplementation(mockUserGetError);

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

  describe('getVotedUsers function', () => {
    describe('given the meetup was found', () => {
      it('should return an array of users who voted for the specified meetup', async () => {
        const votedUsers = await getVotedUsers(mockMeetup.id);
        expect(spiedOnVotedUsersGetHandler).toHaveBeenCalled();
        expect(votedUsers).toEqual(mockShortUsersData);
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await getVotedUsers('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnVotedUsersGetHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('getParticipants function', () => {
    describe('given the meetup was found', () => {
      it('should return an array of users who voted for the specified meetup', async () => {
        const participants = await getParticipants(mockMeetup.id);
        expect(spiedOnParticipantsGetHandler).toHaveBeenCalled();
        expect(participants).toEqual(mockShortUsersData);
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await getParticipants('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnParticipantsGetHandler).toHaveBeenCalled();
        }
      });
    });
  });
});
