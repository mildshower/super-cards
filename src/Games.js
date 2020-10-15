class Games {
  constructor() {
    this.games = {};
    this.lastId = 0;
  }

  addGame(game) {
    this.games[this.lastId] = game;
    return this.lastId++;
  }

  getGame(id) {
    return this.games[id];
  }
}

module.exports = Games;
