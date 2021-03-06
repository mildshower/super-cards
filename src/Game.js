const Player = require("./Player");

const MAX_PLAYER_COUNT = 2;

const getOtherPlayerId = (currPlayerId) => 1 - currPlayerId;

class Game {
  #players;
  #currPlayerId;
  #distributor;
  #cardDeck;
  #shuffler;
  #lastFightDetails;

  constructor(cardDeck, distributor, shuffler) {
    this.#players = [];
    this.#currPlayerId = 0;
    this.#distributor = distributor;
    this.#cardDeck = cardDeck;
    this.#shuffler = shuffler;
  }

  isStarted() {
    return this.#players.length === MAX_PLAYER_COUNT;
  }

  distributeCards() {
    const givenCards = this.#distributor(this.#cardDeck, MAX_PLAYER_COUNT);
    this.#players.forEach((player, index) =>
      player.addCards(givenCards[index])
    );
  }

  addPlayer(name) {
    if (this.isStarted()) return { isAdded: false };

    this.#players.push(new Player(name, this.#shuffler));

    if (this.isStarted()) {
      this.distributeCards();
    }

    return { isAdded: true, id: this.#players.length - 1 };
  }

  get winner() {
    const playersWithCard = this.#players.filter((p) => p.hasCards());

    if (this.isStarted() && playersWithCard.length < MAX_PLAYER_COUNT) {
      return { isWon: true, winner: this.#lastFightDetails.winner };
    }

    return { isWon: false };
  }

  registerFightResult(winnerId, currCard, otherCard, trait) {
    const otherPlayerId = getOtherPlayerId(this.#currPlayerId);
    const playedCards = [];
    playedCards[this.#currPlayerId] = currCard;
    playedCards[otherPlayerId] = otherCard;
    const looserId = getOtherPlayerId(winnerId);

    this.#lastFightDetails = {
      trait,
      winner: { ...this.#players[winnerId].status, id: winnerId },
      looser: { ...this.#players[looserId].status, id: looserId },
      winnerCard: playedCards[winnerId].status,
      looserCard: playedCards[looserId].status,
    };
  }

  fight(trait) {
    if (this.winner.isWon || !this.isStarted()) return { hasFought: false };

    const otherPlayerId = getOtherPlayerId(this.#currPlayerId);
    const currCard = this.#players[this.#currPlayerId].currCard();
    const otherCard = this.#players[otherPlayerId].currCard();
    const hasWon = currCard.doesWinAgainst(otherCard, trait);
    const winnerId = hasWon ? this.#currPlayerId : otherPlayerId;
    this.#players[winnerId].addCards([currCard, otherCard]);
    this.registerFightResult(winnerId, currCard, otherCard, trait);
    this.#currPlayerId = winnerId;

    return { hasFought: true, hasWon };
  }

  inPlayStatus(playerId) {
    const status = { state: "inPlay" };
    status.isOwnTurn = this.#currPlayerId === playerId;
    status.myself = this.#players[playerId].status;
    status.opponent = this.#players[getOtherPlayerId(playerId)].status;
    status.isOwnTurn && delete status.opponent.topCard;
    status.lastFight = this.#lastFightDetails;
    status.lastFight &&
      (status.lastFight.hasWon = status.lastFight.winner.id === playerId);

    return status;
  }

  statusFor(playerId) {
    if (!this.isStarted()) return { state: "notStarted" };

    const { isWon, winner } = this.winner;
    if (isWon)
      return { state: "over", winner, isWinner: winner.id === playerId };

    return this.inPlayStatus(playerId);
  }
}

module.exports = Game;
