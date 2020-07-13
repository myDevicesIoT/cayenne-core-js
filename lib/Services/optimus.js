const Request = require('./../Request');

class Optimus extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {Object} [options]
   */
  constructor(url, token, options = {}) {
    super(Optimus.name, url, token, options);
  }
}

module.exports = Optimus;
