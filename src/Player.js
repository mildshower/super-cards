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

  tryFillCurrCards() {
    if (this.#cards.length == 0) {
      this.#cards = this.#shuffler(this.#secondaryDeck);
      this.#secondaryDeck = [];
    }
  }

  currCard() {
    this.tryFillCurrCards();
    return this.#cards.shift();
  }

  get status() {
    this.tryFillCurrCards();
    return {
      name: this.#name,
      currDeck: this.#cards.length,
      comingDeck: this.#secondaryDeck.length,
      topCard: this.#cards[0] && this.#cards[0].status,
    };
  }
}

module.exports = Player;
