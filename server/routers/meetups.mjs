import express from "express";
import faker from "faker";

import { ensureAuthenticated } from "../middleware/ensureAthenticated.mjs";
import { upload } from '../middleware/upload.mjs';
import { isDateValid, compareDates, getUrlFromPublicPath } from "../utils.mjs";

export const meetupsRoutes = (db) => {
  const meetupsRouter = express.Router();
  meetupsRouter.get("/", async (req, res) => {
    const meetupDtos = db.data.meetups
      .map(meetup => {
        return {
          ...meetup,
          votedUsers: db.data.votedUsers[meetup.id] ?? [],
          participants: db.data.participants[meetup.id] ?? [],
        }
      });

    res.send(meetupDtos);
  });

  meetupsRouter.post(
    "/", 
    ensureAuthenticated, 
    upload.single('image'), 
    async (req, res) => {
      //TODO: validate model data
      try {
        const {
          modified,
          start,
          finish,
          author: authorAsJson,
          subject,
          excerpt,
          place,
        } = req.body;

        const author = JSON.parse(authorAsJson);
        const speakers = [author];

        const image = req.file;
        const imageUrl = image ? getUrlFromPublicPath(image.path) : null;

        const response = {
          id: faker.datatype.uuid(),
          modified,
          start,
          finish,
          author,
          speakers,
          subject,
          excerpt,
          place,
          status: "REQUEST",
          imageUrl,
        };

        if (
          (isDateValid(req.body.start) || req.body.start === undefined) &&
          (isDateValid(req.body.finish) || req.body.finish === undefined) &&
          compareDates(req.body.start, req.body.finish)
        ) {
          db.data.participants[response.id] = [];
          db.data.votedUsers[response.id] = [];
          db.data.meetups.push(response);
          await db.write();
          res.send({
            ...response,
            votedUsers: [],
            participants: [],
          });
        } else {
          res
            .status(500)
            .send(
              "Error. Dates must be valid and start date must be earlier than finish date!"
            );
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  );

  meetupsRouter.get("/:id", async (req, res) => {
    const meetup = db.data.meetups.find((m) => m.id === req.params.id);
    if (!meetup) {
      res.sendStatus(404);
    }

    const meetupDto = {
      ...meetup,
      votedUsers: db.data.votedUsers[meetup.id] ?? [],
      participants: db.data.participants[meetup.id] ?? [],
    };

    res.send(meetupDto);
  });

  meetupsRouter.patch(
    "/:id", 
    ensureAuthenticated,
    upload.single('image'), 
    async (req, res) => {
      try {
        const meetupId = req.params.id;
        const index = db.data.meetups.findIndex(m => m.id === meetupId);

        if (!(index >= 0)) {
          return res.status(404).json({ message: 'Meetup not found' });
        }

        const meetup = db.data.meetups[index];
        const newMeetupData = req.body;

        const author = newMeetupData.author ? JSON.parse(newMeetupData.author) : meetup.author;
        const speakers = newMeetupData.speakers ? JSON.parse(newMeetupData.speakers) : meetup.speakers;

        const image = req.file;
        const imageUrl = image ? getUrlFromPublicPath(image.path) : meetup.imageUrl;

        db.data.meetups[index] = {
          ...meetup,
          ...newMeetupData,
          ...{
            author,
            speakers,
          },
          imageUrl,
        };

        await db.write();
        res.json({
          ...db.data.meetups[index],
          votedUsers: db.data.votedUsers[meetup.id] ?? [],
          participants: db.data.participants[meetup.id] ?? [],
        });
      } catch (e) {
        res.status(500).json({ message: 'Server error' });
      }
    }
  );

  meetupsRouter.delete("/:id", ensureAuthenticated, async (req, res) => {
    const index = db.data.meetups.findIndex((it) => it.id === req.params.id);
    if (index >= 0) {
      db.data.meetups.splice(index, 1);
    }
    await db.write();
    res.send({});
  });

  meetupsRouter.get(
    "/:id/participants",
    async (req, res) => {
      res.send(db.data.participants[req.params.id]);
    }
  );

  meetupsRouter.post(
    "/:id/participants",
    ensureAuthenticated,
    async (req, res) => {
      try {
        const {
          id,
          name,
          surname
        } = req.user;

        const meetupId = req.params.id;
        const participants = db.data.participants[meetupId];

        const checkUser = participants.find((user) => user.id === id);
        if (checkUser) {
          return res.status(400).send({ message: 'Participant is already exist' });
        }

        participants.unshift({ id, name, surname });

        await db.write();
        res.send(participants);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  );

  meetupsRouter.delete(
    "/:id/participants",
    ensureAuthenticated,
    async (req, res) => {
      try {
        const userId = req.user.id;
        const meetupId = req.params.id;
        const participants = db.data.participants[meetupId];

        if (!userId) {
          return res.status(400).send({ message: 'Invalid request data' });
        }

        const foundUser = participants.find(u => u.id === userId);
        if (!foundUser) {
          return res.status(404).send({ message: 'Participant not found' });
        }

        db.data.participants[meetupId] = participants.filter(u => u.id !== userId);

        await db.write();
        res.send(db.data.participants[meetupId]);
      } catch (e) {
        console.log(e);
        res.status(500).send(e);
      }
    }
  );

  meetupsRouter.get(
    "/:id/votedusers",
    async (req, res) => {
      res.send(db.data.votedUsers[req.params.id]);
    }
  );

  meetupsRouter.post(
    "/:id/votedusers",
    ensureAuthenticated,
    async (req, res) => {
      try {
        const {
          id,
          name,
          surname
        } = req.user;

        const meetupId = req.params.id;

        const checkUser = db.data.votedUsers[meetupId].find((user) => user.id === id)
        if (checkUser) {
          return res.status(400).send({ message: 'The user is already voted' });
        }

        db.data.votedUsers[meetupId].unshift({ id, name, surname });

        await db.write();
        res.send(db.data.votedUsers[meetupId]);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  );

  meetupsRouter.delete(
    "/:id/votedusers",
    ensureAuthenticated,
    async (req, res) => {
      try {
        const userId = req.user.id;
        const meetupId = req.params.id;
        const users = db.data.votedUsers[meetupId];

        const foundUser = users.find(u => u.id === userId);
        if (!foundUser) {
          return res.status(404).send({ message: 'User not found' });
        }

        db.data.votedUsers[meetupId] = users.filter(u => u.id !== userId);

        await db.write();
        res.send(db.data.votedUsers[meetupId]);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  );

  return meetupsRouter;
};
