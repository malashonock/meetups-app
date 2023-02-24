import express from "express";
import { getShortUserFrom } from "../data/users.mjs";

export const usersRoutes = (db) => {
  const router = express.Router();
  router.get("/", async (req, res) => {
    const shortUsers = db.data.users.map(getShortUserFrom);
    res.send(shortUsers);
  });

  router.get("/:id", async (req, res) => {
    const user = db.data.users.find((p) => p.id === req.params.id);
    res.send(getShortUserFrom(user));
  });
  return router;
};
