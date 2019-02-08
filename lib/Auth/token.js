const jwt = require('jsonwebtoken');

class Token {
  /**
   * Construct a token.
   *
   * @param {String} token The JSON Web Token formatted token string.
   * @param {String} refresh The JSON Web Token formatated refresh token string.
   */
  constructor(token, refresh) {
    this.token = token;
    this.refresh = refresh;

    try {
      this.content = jwt.decode(token);
    } catch (err) {
      this.content = {
        exp: 0
      };
    }
  }

  /**
   * Determine if this token is expired.
   *
   * @return {boolean} `true` if it is expired, otherwise `false`.
   */
  isExpired() {
    return this.content.exp * 1000 < Date.now();
  }
}

module.exports = Token;
