const url = require("url");
const Game = require("./Game");
const Card = require("./Card");
const cardDetails = require("./cardData.json");
const { distributeRandom, shuffle, pickRandom } = require("./cardTools");
const { RSA_NO_PADDING } = require("constants");

const MAX_CARD_COUNT = 52;

const generateDeck = (cardDetails) => {
  const chosenCards = pickRandom(MAX_CARD_COUNT, cardDetails);
  const deck = chosenCards.map((c) => new Card(c));

  return deck;
};

const logger = function (req, res, next) {
  console.log(req.method, req.url);
  next();
};

const plantUserData = function (req, res, next) {
  const userData = req.app.locals.sessions.getUserData(req.cookies._SID);

  if (userData) {
    req.game = req.app.locals.games.getGame(userData.gameId);
    req.playerId = userData.playerId;
  }

  next();
};

const hostGame = function (req, res) {
  const playerName = url.parse(req.url, true).query.pName;
  const game = new Game(generateDeck(cardDetails), distributeRandom, shuffle);
  const playerId = game.addPlayer(playerName).id;
  const gameId = req.app.locals.games.addGame(game);
  const sessionId = req.app.locals.sessions.addSession({ playerId, gameId });

  res.cookie("_SID", sessionId).json({ gameId });
};

const serveIsGameStarted = function (req, res) {
  res.json({ isStarted: req.game.isStarted() });
};

const joinGame = function (req, res) {
  const { gameId, pName } = url.parse(req.url, true).query;
  const game = req.app.locals.games.getGame(gameId);

  if (!game) return res.json({ error: `${gameId} is invalid Game Id` });

  const { isAdded, id } = game.addPlayer(pName);

  if (!isAdded) return res.json({ error: `Game is already started` });

  const sessionId = req.app.locals.sessions.addSession({
    playerId: id,
    gameId,
  });

  res.cookie("_SID", sessionId).json({ isJoined: true });
};

const serveGameStatus = function (req, res) {
  const playerDetails = req.game.statusFor(req.playerId);
  res.json(playerDetails);
};

const fight = function (req, res) {
  const { trait } = url.parse(req.url, true).query;
  req.game.fight(trait);
  res.end();
};

module.exports = {
  plantUserData,
  logger,
  hostGame,
  serveIsGameStarted,
  joinGame,
  serveGameStatus,
  fight,
};
