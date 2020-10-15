class Card {
  #id;
  #name;
  #intelligence;
  #strength;
  #speed;
  #durability;
  #power;
  #combat;
  #height;
  #weight;
  #img;

  constructor(cardDetails) {
    this.#id = cardDetails.id;
    this.#name = cardDetails.name;
    this.#intelligence = cardDetails.intelligence;
    this.#strength = cardDetails.strength;
    this.#speed = cardDetails.speed;
    this.#durability = cardDetails.durability;
    this.#power = cardDetails.power;
    this.#combat = cardDetails.combat;
    this.#height = cardDetails.height;
    this.#weight = cardDetails.weight;
    this.#img = cardDetails.img;
  }

  doesWinAgainst(otherCard, trait) {
    switch (trait) {
      case "intelligence":
        return this.#intelligence >= otherCard.#intelligence;
      case "strength":
        return this.#strength >= otherCard.#strength;
      case "speed":
        return this.#speed >= otherCard.#speed;
      case "durability":
        return this.#durability >= otherCard.#durability;
      case "power":
        return this.#power >= otherCard.#power;
      case "combat":
        return this.#combat >= otherCard.#combat;
      case "height":
        return this.#height >= otherCard.#height;
      case "weight":
        return this.#weight >= otherCard.#weight;
    }
  }

  get status() {
    return {
      id: this.#id,
      name: this.#name,
      intelligence: this.#intelligence,
      strength: this.#strength,
      speed: this.#speed,
      durability: this.#durability,
      power: this.#power,
      combat: this.#combat,
      height: this.#height,
      weight: this.#weight,
      img: this.#img,
    };
  }
}

module.exports = Card;
