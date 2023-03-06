/* eslint-disable jest/no-conditional-expect */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  getMeetup,
  getMeetups,
  updateMeetup,
  createMeetup,
  deleteMeetup,
  getVotedUsers,
  getParticipants,
  voteForMeetup,
  withdrawVoteForMeetup,
  cancelJoinMeetup,
  joinMeetup,
} from 'api';
import * as StaticApi from 'api/services/static.service';
import {
  mockMeetupData,
  mockMeetup,
  mockImagesWithUrl,
  mockMeetupFields,
  generateMeetupsData,
  mockUsersData,
} from 'model/__fakes__';
import { apiUrl, RestResolver } from 'utils';
import { FileWithUrl } from 'types';
import { IMeetup } from 'model';

// Mock getStaticFile
const mockGetStaticFile = jest.spyOn(StaticApi, 'getStaticFile');

const mockMeetupsData: IMeetup[] = [mockMeetupData, ...generateMeetupsData(20)];

const mockMeetupsGetSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockMeetupsData));
};

const mockMeetupGetHandler: RestResolver = (req, res, ctx) => {
  return req.params.id === mockMeetup.id
    ? res(ctx.status(200), ctx.json(mockMeetupData))
    : res(ctx.status(404));
};

const mockMeetupPostSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(201), ctx.json(mockMeetupData));
};

const mockMeetupPatchSuccess: RestResolver = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockMeetupData));
};

const mockMeetupDeleteSuccess: RestResolver = (req, res, ctx) => {
  return req.params.id === mockMeetup.id
    ? res(ctx.status(200))
    : res(ctx.status(404));
};

const mockInternalServerError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(500));
};

const mockUnauthorizedError: RestResolver = (req, res, ctx) => {
  return res(ctx.status(401));
};

const mockRelatedUsersHandler: RestResolver = (req, res, ctx) => {
  return req.params.id === mockMeetup.id
    ? res(ctx.status(200), ctx.json(mockUsersData))
    : res(ctx.status(404));
};

const spiedOnMeetupsGetHandler = jest.fn();
const spiedOnMeetupGetHandler = jest.fn();
const spiedOnMeetupPostHandler = jest.fn();
const spiedOnMeetupPatchHandler = jest.fn();
const spiedOnMeetupDeleteHandler = jest.fn();
const spiedOnVotedUsersGetHandler = jest.fn();
const spiedOnVotedUsersPostHandler = jest.fn();
const spiedOnVotedUsersDeleteHandler = jest.fn();
const spiedOnParticipantsGetHandler = jest.fn();
const spiedOnParticipantsPostHandler = jest.fn();
const spiedOnParticipantsDeleteHandler = jest.fn();

const server = setupServer(
  rest.get(apiUrl('/meetups'), spiedOnMeetupsGetHandler),
  rest.get(apiUrl('/meetups/:id'), spiedOnMeetupGetHandler),
  rest.post(apiUrl('/meetups'), spiedOnMeetupPostHandler),
  rest.patch(apiUrl('/meetups/:id'), spiedOnMeetupPatchHandler),
  rest.delete(apiUrl('/meetups/:id'), spiedOnMeetupDeleteHandler),
  rest.get(apiUrl('/meetups/:id/votedusers'), spiedOnVotedUsersGetHandler),
  rest.post(apiUrl('/meetups/:id/votedusers'), spiedOnVotedUsersPostHandler),
  rest.delete(
    apiUrl('/meetups/:id/votedusers'),
    spiedOnVotedUsersDeleteHandler,
  ),
  rest.get(apiUrl('/meetups/:id/participants'), spiedOnParticipantsGetHandler),
  rest.post(
    apiUrl('/meetups/:id/participants'),
    spiedOnParticipantsPostHandler,
  ),
  rest.delete(
    apiUrl('/meetups/:id/participants'),
    spiedOnParticipantsDeleteHandler,
  ),
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
  spiedOnMeetupsGetHandler.mockImplementation(mockMeetupsGetSuccess);
  spiedOnMeetupGetHandler.mockImplementation(mockMeetupGetHandler);
  spiedOnMeetupPostHandler.mockImplementation(mockMeetupPostSuccess);
  spiedOnMeetupPatchHandler.mockImplementation(mockMeetupPatchSuccess);
  spiedOnMeetupDeleteHandler.mockImplementation(mockMeetupDeleteSuccess);
  spiedOnVotedUsersGetHandler.mockImplementation(mockRelatedUsersHandler);
  spiedOnVotedUsersPostHandler.mockImplementation(mockRelatedUsersHandler);
  spiedOnVotedUsersDeleteHandler.mockImplementation(mockRelatedUsersHandler);
  spiedOnParticipantsGetHandler.mockImplementation(mockRelatedUsersHandler);
  spiedOnParticipantsPostHandler.mockImplementation(mockRelatedUsersHandler);
  spiedOnParticipantsDeleteHandler.mockImplementation(mockRelatedUsersHandler);
});

afterEach(() => {
  server.resetHandlers();
  jest.resetAllMocks();
});

describe('Meetups API service', () => {
  describe('getMeetups function', () => {
    it('should return an array of all meetups', async () => {
      const meetups = await getMeetups();
      expect(spiedOnMeetupsGetHandler).toHaveBeenCalled();
      expect(meetups).toEqual(mockMeetupsData);
    });
  });

  describe('getMeetup function', () => {
    describe('given the meetup was found', () => {
      it('should return the meetup with the specified id', async () => {
        const foundMeetup = await getMeetup(mockMeetup.id);
        expect(spiedOnMeetupGetHandler).toHaveBeenCalled();
        expect(foundMeetup).toEqual(mockMeetupData);
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await getMeetup('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnMeetupGetHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('createMeetup function', () => {
    describe('given user is logged in & form fields are filled correctly', () => {
      it('should return the newly created meetup', async () => {
        const createdMeetup = await createMeetup(mockMeetupFields);
        expect(spiedOnMeetupPostHandler).toHaveBeenCalled();
        expect(createdMeetup).toEqual(mockMeetupData);
      });
    });

    describe('given user is not logged in', () => {
      it('should reject with a 401 error', async () => {
        spiedOnMeetupPostHandler.mockImplementation(mockUnauthorizedError);

        expect.assertions(2);
        try {
          await createMeetup(mockMeetupFields);
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnMeetupPostHandler).toHaveBeenCalled();
        }
      });
    });

    describe('given there are problems with the filled data', () => {
      it('should reject with a 500 error', async () => {
        spiedOnMeetupPostHandler.mockImplementation(mockInternalServerError);

        expect.assertions(2);
        try {
          await createMeetup(mockMeetupFields);
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnMeetupPostHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('updateMeetup function', () => {
    describe('given user is logged in & form fields are filled correctly', () => {
      it('should return the updated meetup', async () => {
        const updatedMeetup = await updateMeetup(
          mockMeetup.id,
          mockMeetupFields,
        );
        expect(spiedOnMeetupPatchHandler).toHaveBeenCalled();
        expect(updatedMeetup).toEqual(mockMeetupData);
      });
    });

    describe('given user is not logged in', () => {
      it('should reject with a 401 error', async () => {
        spiedOnMeetupPatchHandler.mockImplementation(mockUnauthorizedError);

        expect.assertions(2);
        try {
          await updateMeetup(mockMeetup.id, mockMeetupFields);
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnMeetupPatchHandler).toHaveBeenCalled();
        }
      });
    });

    describe('given there are problems with the filled data', () => {
      it('should reject with a 500 error', async () => {
        spiedOnMeetupPatchHandler.mockImplementation(mockInternalServerError);

        expect.assertions(2);
        try {
          await updateMeetup(mockMeetup.id, mockMeetupFields);
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnMeetupPatchHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('deleteMeetup function', () => {
    describe('given the meetup was found', () => {
      it('should delete the meetup with the specified id', async () => {
        await deleteMeetup(mockMeetup.id);
        expect(spiedOnMeetupDeleteHandler).toHaveBeenCalled();
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await deleteMeetup('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnMeetupDeleteHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('getVotedUsers function', () => {
    describe('given the meetup was found', () => {
      it('should return an array of users who voted for the specified meetup', async () => {
        const votedUsers = await getVotedUsers(mockMeetup.id);
        expect(spiedOnVotedUsersGetHandler).toHaveBeenCalled();
        expect(votedUsers).toEqual(mockUsersData);
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

  describe('voteForMeetup function', () => {
    describe('given the meetup was found', () => {
      it('should return a complemented array of users who voted for the specified meetup', async () => {
        const votedUsers = await voteForMeetup(mockMeetup.id);
        expect(spiedOnVotedUsersPostHandler).toHaveBeenCalled();
        expect(votedUsers).toEqual(mockUsersData);
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await voteForMeetup('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnVotedUsersPostHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('withdrawVoteForMeetup function', () => {
    describe('given the meetup was found', () => {
      it('should return a reduced array of users who voted for the specified meetup', async () => {
        const votedUsers = await withdrawVoteForMeetup(mockMeetup.id);
        expect(spiedOnVotedUsersDeleteHandler).toHaveBeenCalled();
        expect(votedUsers).toEqual(mockUsersData);
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await withdrawVoteForMeetup('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnVotedUsersDeleteHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('getParticipants function', () => {
    describe('given the meetup was found', () => {
      it('should return an array of users who would join the specified meetup', async () => {
        const participants = await getParticipants(mockMeetup.id);
        expect(spiedOnParticipantsGetHandler).toHaveBeenCalled();
        expect(participants).toEqual(mockUsersData);
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

  describe('joinMeetup function', () => {
    describe('given the meetup was found', () => {
      it('should return a complemented array of users who would join the specified meetup', async () => {
        const participants = await joinMeetup(mockMeetup.id);
        expect(spiedOnParticipantsPostHandler).toHaveBeenCalled();
        expect(participants).toEqual(mockUsersData);
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await joinMeetup('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnParticipantsPostHandler).toHaveBeenCalled();
        }
      });
    });
  });

  describe('cancelJoinMeetup function', () => {
    describe('given the meetup was found', () => {
      it('should return a reduced array of users who would join the specified meetup', async () => {
        const participants = await cancelJoinMeetup(mockMeetup.id);
        expect(spiedOnParticipantsDeleteHandler).toHaveBeenCalled();
        expect(participants).toEqual(mockUsersData);
      });
    });

    describe('given no meetup was found', () => {
      it('should reject with a 404 error', async () => {
        expect.assertions(2);
        try {
          await cancelJoinMeetup('invalid-id');
        } catch (error) {
          expect(error).toBeTruthy();
        } finally {
          expect(spiedOnParticipantsDeleteHandler).toHaveBeenCalled();
        }
      });
    });
  });
});
