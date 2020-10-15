const Player = require("./Player");

const MAX_PLAYER_COUNT = 2;

const getOtherPlayerId = (currPlayerId) => 1 - currPlayerId;

class Game {
  #players;
  #currPlayerId;
  #distributor;
  #cardDeck;
  #currPlayerCard;
  #shuffler;

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

  get currPlayerId() {
    return this.#currPlayerId;
  }

  pickCurrPlayerCard() {
    if (this.#currPlayerCard) return { isPicked: false };

    this.#currPlayerCard = this.#players[this.#currPlayerId].currCard();
    return { isPicked: true, card: this.#currPlayerCard };
  }

  addPlayer(name) {
    if (this.isStarted()) return false;

    this.#players.push(new Player(name, this.#shuffler));

    if (this.isStarted()) {
      const givenCards = this.#distributor(this.#cardDeck, MAX_PLAYER_COUNT);
      this.#players.forEach((player, index) =>
        player.addCards(givenCards[index])
      );
    }

    return true;
  }

  get winner() {
    const playersWithCard = this.#players.filter((p) => p.hasCards());

    if (this.isStarted() && playersWithCard.length < MAX_PLAYER_COUNT) {
      return { isWon: true, winner: playersWithCard[0] };
    }

    return { isWon: false };
  }

  generateFightResult(winnerId, otherPlayerCard, trait) {
    const otherPlayerId = getOtherPlayerId(this.#currPlayerId);
    const playedCards = [];
    playedCards[this.#currPlayerId] = this.#currPlayerCard;
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

    if (!this.#currPlayerCard) this.pickCurrPlayerCard();

    const otherPlayerId = getOtherPlayerId(this.#currPlayerId);
    const otherPlayerCard = this.#players[otherPlayerId].currCard();
    const currCardWins = this.#currPlayerCard.doesWinAgainst(
      otherPlayerCard,
      trait
    );
    const winnerId = currCardWins ? this.#currPlayerId : otherPlayerId;
    const fightDetails = this.generateFightResult(
      winnerId,
      otherPlayerCard,
      trait
    );
    this.#currPlayerId = winnerId;
    this.#currPlayerCard = null;

    return { hasFought: true, fightDetails };
  }
}

module.exports = Game;
