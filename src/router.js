const express = require("express");
const cookieParser = require("cookie-parser");
const Sessions = require("./Sessions");
const Games = require("./Games");
const {
  plantUserData,
  logger,
  hostGame,
  serveIsGameStarted,
  joinGame,
  serveGameStatus,
  fight,
} = require("./handlers");

const app = express();

app.locals.sessions = new Sessions();
app.locals.games = new Games();

app.use(logger);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use(plantUserData);

app.get("/game/host", hostGame);
app.get("/game/isStarted", serveIsGameStarted);
app.get("/game/join", joinGame);
app.get("/game/playerDetails", serveGameStatus);
app.get("/game/fight", fight);

module.exports = app;
