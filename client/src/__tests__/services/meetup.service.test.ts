/* eslint-disable jest/no-conditional-expect */

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  getMeetup,
  getMeetups,
  updateMeetup,
  createMeetup,
  deleteMeetup,
} from 'api';
import * as StaticApi from 'api/services/static.service';
import * as MeetupApi from 'api/services/meetup.service';
import {
  mockMeetupData,
  mockMeetup,
  mockImagesWithUrl,
  mockMeetupFields,
  generateMeetupsData,
} from 'model/__fakes__';
import { apiUrl, RestResolver } from 'utils';
import { FileWithUrl } from 'types';
import { IUser, IMeetup } from 'model';

// Mock getNewsFromJson
const mockGetStaticFile = jest.spyOn(StaticApi, 'getStaticFile');

// Mock getVotedUsers & getParticipants
const mockGetVotedUsers = jest.spyOn(MeetupApi, 'getVotedUsers');
const mockGetParticipants = jest.spyOn(MeetupApi, 'getParticipants');

const mockMeetupsData: IMeetup[] = [mockMeetupData, ...generateMeetupsData(20)];
const findMeetup = (id: string) => {
  return mockMeetupsData.filter(
    (meetupDto: IMeetup): boolean => meetupDto.id === id,
  )[0];
};

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

const spiedOnMeetupsGetHandler = jest.fn();
const spiedOnMeetupGetHandler = jest.fn();
const spiedOnMeetupPostHandler = jest.fn();
const spiedOnMeetupPatchHandler = jest.fn();
const spiedOnMeetupDeleteHandler = jest.fn();

const server = setupServer(
  rest.get(apiUrl('/meetups'), spiedOnMeetupsGetHandler),
  rest.get(apiUrl('/meetups/:id'), spiedOnMeetupGetHandler),
  rest.post(apiUrl('/meetups'), spiedOnMeetupPostHandler),
  rest.patch(apiUrl('/meetups/:id'), spiedOnMeetupPatchHandler),
  rest.delete(apiUrl('/meetups/:id'), spiedOnMeetupDeleteHandler),
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
  mockGetVotedUsers.mockImplementation(
    async (meetupId: string): Promise<IUser[]> => {
      return findMeetup(meetupId).votedUsers;
    },
  );
  mockGetParticipants.mockImplementation(
    async (meetupId: string): Promise<IUser[]> => {
      return findMeetup(meetupId).participants;
    },
  );
  spiedOnMeetupsGetHandler.mockImplementation(mockMeetupsGetSuccess);
  spiedOnMeetupGetHandler.mockImplementation(mockMeetupGetHandler);
  spiedOnMeetupPostHandler.mockImplementation(mockMeetupPostSuccess);
  spiedOnMeetupPatchHandler.mockImplementation(mockMeetupPatchSuccess);
  spiedOnMeetupDeleteHandler.mockImplementation(mockMeetupDeleteSuccess);
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
});
