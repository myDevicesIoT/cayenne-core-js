class Prometheus {
  /**
   * @param {String} url
   * @param {typeof Auth} Auth
   */
  constructor(url, Auth) {
    this.service = Prometheus.name;
    this.url = url;
    this.auth = Auth;
  }

  /**
   * @param {String}  network
   * @param {String}  hardwareId
   */
  getState(network, hardwareId) {
    const url = `${
      this.url
    }/v1/networks/${network}/gateways/${hardwareId}/state`;
    return this.auth.send(this.service, 'GET', url, { isPublic: true });
  }

  /**
   * @param {String} network
   * @param {String} hardwareId
   */
  checkIn(network, hardwareId) {
    const url = `${
      this.url
    }/v1/networks/${network}/gateways/${hardwareId}/state`;
    return this.auth.send(this.service, 'POST', url, { isPublic: true });
  }

  sendUplink(network, payload) {
    const url = `${this.url}/v1/networks/${network}/uplink`;
    return this.auth.send(this.service, 'POST', url, {
      isPublic: true,
      payload
    });
  }
}

module.exports = Prometheus;
