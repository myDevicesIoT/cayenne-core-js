const Request = require('./../Request');

class Prometheus extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {object} [options]
   */
  constructor(url, token, options = {}) {
    super(Prometheus.name, url, token, options);
  }

  /**
   * @param {String}  network
   * @param {String}  hardwareId
   */
  getState(network, hardwareId) {
    const path = `/v1/networks/${network}/gateways/${hardwareId}/state`;
    return this.send('GET', path, { isPublic: true });
  }

  /**
   * @param {String} network
   * @param {String} hardwareId
   */
  checkIn(network, hardwareId) {
    const path = `/v1/networks/${network}/gateways/${hardwareId}/state`;
    return this.send('POST', path, { isPublic: true });
  }

  sendUplink(network, payload) {
    const path = `/v1/networks/${network}/uplink`;
    return this.send('POST', path, {
      isPublic: true,
      payload
    });
  }
}

module.exports = Prometheus;
