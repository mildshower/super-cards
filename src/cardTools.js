const shuffle = function (cards) {
  let from = [...cards];
  const to = [];

  while (from.length > 0) {
    const fromIndex = Math.floor(Math.random() * from.length);
    to.push(from[fromIndex]);
    from = from.filter((_, index) => index !== fromIndex);
  }

  return to;
};

const pickRandom = function (count, cards) {
  return shuffle(cards).slice(0, count);
};

const distributeRandom = function (cards, count) {
  const parts = new Array(count).fill().map(() => []);
  const shuffledCards = shuffle(cards);
  let currTurn = 0;

  while (shuffledCards.length > 0) {
    parts[currTurn].push(shuffledCards.pop());
    currTurn = (currTurn + 1) % count;
  }

  return parts;
};

module.exports = { shuffle, pickRandom, distributeRandom };
