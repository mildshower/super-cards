const { shuffle, distributeRandom, pickRandom } = require("./cardTools");
const Game = require("./Game");
const Card = require("./Card");
const cardDetails = require("./cardData.json");

const generateDeck = (cardDetails) => {
  const chosenCards = pickRandom(52, cardDetails);
  const deck = chosenCards.map((c) => new Card(c));

  return deck;
};

const main = function () {
  const deck = generateDeck(cardDetails);
  const game = new Game(deck, distributeRandom, shuffle);

  console.log(game.currPlayerId);
  console.log(game.isStarted());
  console.log(game.winner);
  console.log(game.addPlayer("Sid"));
  console.log(game.addPlayer("Trinangkur"));
  console.log("players added");
  console.log(game.isStarted());
  console.log(game.winner);
  console.log(game.pickCurrPlayerCard().card.status);
  console.log(game.fight("power"));
  console.log(game.currPlayerId);
  console.log(game.winner);
  console.log(game.fight("speed"));
  console.log(game.pickCurrPlayerCard().card.status);
  console.log(game.fight("speed"));
};

main();
