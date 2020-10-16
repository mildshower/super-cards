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

  addPlayer(name) {
    if (this.isStarted()) return { isAdded: false };

    this.#players.push(new Player(name, this.#shuffler));

    if (this.isStarted()) {
      const givenCards = this.#distributor(this.#cardDeck, MAX_PLAYER_COUNT);
      this.#players.forEach((player, index) =>
        player.addCards(givenCards[index])
      );
    }

    return { isAdded: true, id: this.#players.length - 1 };
  }

  get winner() {
    const playersWithCard = this.#players.filter((p) => p.hasCards());

    if (this.isStarted() && playersWithCard.length < MAX_PLAYER_COUNT) {
      return { isWon: true, winner: playersWithCard[0] };
    }

    return { isWon: false };
  }

  generateFightResult(winnerId, currCard, otherPlayerCard, trait) {
    const otherPlayerId = getOtherPlayerId(this.#currPlayerId);
    const playedCards = [];
    playedCards[this.#currPlayerId] = currCard;
    playedCards[otherPlayerId] = otherPlayerCard;
    const looserId = getOtherPlayerId(winnerId);

    return {
      trait,
      winner: { ...this.#players[winnerId].status, id: winnerId },
      looser: { ...this.#players[looserId].status, id: looserId },
      winnerCard: playedCards[winnerId].status,
      looserCard: playedCards[looserId].status,
    };
  }

  fight(trait) {
    if (this.winner.isWon || !this.isStarted()) return { hasFought: false };

    const currCard = this.#players[this.#currPlayerId].currCard();
    const otherPlayerId = getOtherPlayerId(this.#currPlayerId);
    const otherPlayerCard = this.#players[otherPlayerId].currCard();
    const currCardWins = currCard.doesWinAgainst(otherPlayerCard, trait);
    const winnerId = currCardWins ? this.#currPlayerId : otherPlayerId;
    this.#players[winnerId].addCards([currCard, otherPlayerCard]);
    this.#lastFightDetails = this.generateFightResult(
      winnerId,
      currCard,
      otherPlayerCard,
      trait
    );
    this.#currPlayerId = winnerId;

    return { hasFought: true, hasWon: currCardWins };
  }

  statusFor(playerId) {
    const status = {};
    status.isOwnTurn = this.#currPlayerId === playerId;
    status.lastFightDetails = this.#lastFightDetails;
    status.lastFightDetails &&
      (status.lastFightDetails.hasWon =
        this.#lastFightDetails.winner.id === playerId);
    status.myself = this.#players[playerId].status;
    status.opponent = this.#players[getOtherPlayerId(playerId)].status;
    status.isOwnTurn && delete status.opponent.topCard;

    return status;
  }

  playersNamesFor(playerId) {
    return {
      own: this.#players[playerId].status.name,
      opponent: this.#players[getOtherPlayerId(playerId)].status.name,
    };
  }
}

module.exports = Game;
