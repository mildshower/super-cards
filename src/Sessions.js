const getUniqSId = function () {
  return `${+new Date()}`;
};

class Sessions {
  constructor() {
    this.sessions = {};
  }

  addSession(userData) {
    const id = getUniqSId();
    this.sessions[id] = userData;
    return id;
  }

  getUserData(id) {
    return this.sessions[id];
  }
}

module.exports = Sessions;
