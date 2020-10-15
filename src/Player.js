class Player {
  #cards;
  #name;
  #shuffler;
  #secondaryDeck;

  constructor(name, shuffler) {
    this.#name = name;
    this.#shuffler = shuffler;
    this.#cards = [];
    this.#secondaryDeck = [];
  }

  addCards(cards) {
    this.#secondaryDeck.push(...cards);
    return this.#secondaryDeck.length;
  }

  hasCards() {
    return this.#cards.length + this.#secondaryDeck.length > 0;
  }

  currCard() {
    if (this.#cards.length == 0) {
      this.#cards = this.#shuffler(this.#secondaryDeck);
      this.#secondaryDeck = [];
    }

    return this.#cards.shift();
  }

  peekCard() {
    if (this.#cards.length == 0) {
      this.#cards = this.#shuffler(this.#secondaryDeck);
      this.#secondaryDeck = [];
    }

    return this.#cards[0];
  }

  get status() {
    return {
      name: this.#name,
      primaryCardsCount: this.#cards.length,
      secondaryCardsCount: this.#secondaryDeck.length,
    };
  }
}

module.exports = Player;
