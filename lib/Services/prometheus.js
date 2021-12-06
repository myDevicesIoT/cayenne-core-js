const Request = require('./../Request');

class Prometheus extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {Object} [options]
   */
  constructor(url, token, options = {}) {
    super(Prometheus.name, url, token, options);
  }

  /**
   * @param {string}  network
   * @param {string}  hardwareId
   */
  getState(network, hardwareId) {
    const path = `/v1/networks/${network}/gateways/${hardwareId}/state`;
    return this.send('GET', path, { isPublic: true });
  }

  /**
   * @param {string} network
   * @param {string} hardwareId
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

  simulateUplink(thing_id, hardware_id, device_type_id, options) {
    const path = `/v1/delegate/uplink-simulate`;
    const payload = {
      thing_id,
      hardware_id,
      device_type_id,
      options,
    };

    return this.send('POST', path, {
      isPublic: true,
      payload
    });
  }
}

module.exports = Prometheus;
