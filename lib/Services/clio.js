const Request = require('./../Request');

class Clio extends Request {
  constructor(url, token, options = {}) {
    super(Clio.name, url, token, options);
  }

  validateFormula(assetId, formula) {
    const path = `/assets/formula/validate`;
    const payload = { asset_id: assetId, formula };

    return this.send('POST', path, { payload });
  }
}

module.exports = Clio;
