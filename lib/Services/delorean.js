class Delorean {
  /**
   * @param {String} url
   * @param {typeof Auth} Auth
   */
  constructor(url, Auth) {
    this.service = Delorean.name;
    this.url = url;
    this.auth = Auth;
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   * @param {String}  query.type
   * @param {String}  query.units
   */
  getDeviceSummary(userId, deviceId, query) {
    const url = `${this.url}/devices/${deviceId}/summaries`;
    query = { ...query, user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {String}  sensorId
   * @param {Object}  query
   * @param {String}  query.type
   * @param {String}  query.units
   */
  getSensorSummary(userId, deviceId, sensorId, query) {
    const url = `${this.url}/devices/${deviceId}/sensors/${sensorId}/summaries`;
    query = { ...query, user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {Object} query
   */
  getMetrics(userId, query) {
    const url = `${this.url}/metrics`;
    query = { ...query, user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * get latest checkin timestamp of deviceId
   *
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Boolean} getSensors
   */
  getDeviceLastCheckIn(userId, deviceId, getSensors) {
    const url = `${this.url}/devices/${deviceId}/last-checkin`;
    const query = { user_id: userId, sensors: getSensors };

    return this.auth.send(this.service, 'GET', url, { query });
  }
}

module.exports = Delorean;
