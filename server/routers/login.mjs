import express from "express";
import passport from "passport";
import { ensureAuthenticated } from "../middleware/ensureAthenticated.mjs";
export const loginRoutes = express.Router();

// cookie-based authentication
loginRoutes.get("/login", ensureAuthenticated, 
  (req, res) => {
    const { password, ...cleanUser } = req.user;
    return res.json(cleanUser);
  });

loginRoutes.post(
  "/login",
  function (req, res, next) {
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    const user = JSON.parse(JSON.stringify(req.user)); // hack
    const { password, ...cleanUser } = user;
    res.json(cleanUser);
  }
);

loginRoutes.get("/logout", function (req, res, next) {
  req.logout();
  res.status(200);
  res.send({});
});
