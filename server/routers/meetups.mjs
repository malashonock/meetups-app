import express from "express";
import { ensureAuthenticated } from "../ensureAthenticated.mjs";
import faker from "faker";
import { isDateValid } from "../utils.mjs";
import { compareDates } from "../utils.mjs";

export const meetupsRoutes = (db) => {
  const meetupsRouter = express.Router();
  meetupsRouter.get("/", async (req, res) => {
    res.send(db.data.meetups);
  });

  meetupsRouter.post("/", ensureAuthenticated, async (req, res) => {
    //TODO: validate model data
    try {
      const response = {
        id: faker.datatype.uuid(),
        modified: req.body.modified,
        start: req.body.start,
        finish: req.body.finish,
        author: {
          id: req.body.author.id,
          name: req.body.author.name,
          surname: req.body.author.surname,
        },
        speakers: req.body.speakers.map((s) => ({
          id: faker.datatype.uuid(),
          name: s.name,
          surname: s.surname,
        })),
        subject: req.body.subject,
        excerpt: req.body.excerpt,
        place: req.body.place,
        goCount: 0,
        status: "REQUEST",
        isOver: false,
        image: req.body.image,
      };

      if (
        (isDateValid(req.body.start) || req.body.start === undefined) &&
        (isDateValid(req.body.finish) || req.body.finish === undefined) &&
        compareDates(req.body.start, req.body.finish)
      ) {
        db.data.participants[response.id] = [];
        db.data.votedUsers[response.id] = [];
        const meetup = db.data.meetups.push(response);
        await db.write();
        res.send(response);
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
  });

  meetupsRouter.put("/", ensureAuthenticated, async (req, res) => {
        const index = db.data.meetups.findIndex((it) => it.id === req.body.id);
        db.data.meetups[index] = {...db.data.meetups[index], ...req.body};
        await db.write();
        res.send(db.data.meetups[index]);
    });

  meetupsRouter.get("/:id", async (req, res) => {
    const meetup = db.data.meetups.find((m) => m.id === req.params.id);
    if (!meetup) {
      res.sendStatus(404);
    }
    res.send(meetup);
  });

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

        participants.push({ id, name, surname });

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

        const findedUser = participants.find(u => u.id === userId);
        if (!findedUser) {
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

        db.data.votedUsers[meetupId].push({ id, name, surname });

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

        const findedUser = users.find(u => u.id === userId);
        if (!findedUser) {
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
