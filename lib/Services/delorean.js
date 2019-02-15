class Delorean {
  /**
   * @param {String} url
   * @param {typeof Auth} Auth
   */
  constructor(url, Auth) {
    this.service = Delorean.name;
    // new env
    if (url.indexOf('delorean-es') > -1) {
      this.esUrl = url;
      this.url = url.replace('delorean-es', 'delorean');
    } else {
      this.url = url;
      this.esUrl = url.replace('delorean', 'delorean-es');
    }
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

  /** methods below will be used to get data from elasticsearch */
  /**
   * get latest checkin timestamp of deviceId
   *  sensors - get sensors or not
   *
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {boolean} getSensors
   */
  getDeviceCheckIn(userId, deviceId, getSensors) {
    const url = `${this.esUrl}/devices/${deviceId}/checkin`;
    query = { user_id: userId, sensors: getSensors };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   * @param {String}  query.type
   * @param {String}  query.units
   */
  getDeviceState(userId, deviceId, query) {
    const url = `${this.esUrl}/devices/${deviceId}/state`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceIds
   * @param {Object}  query
   */
  getDevicesState(userId, deviceIds, query) {
    const url = `${this.esUrl}/devices/state`;
    query = { ...query, user_id: userId, devices: deviceIds };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceTotals(userId, deviceId, query) {
    const url = `${this.esUrl}/devices/${deviceId}/totals`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceAggregations(userId, deviceId, query) {
    const url = `${this.esUrl}/devices/${deviceId}/aggregations`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceReadings(userId, deviceId, query) {
    const url = `${this.esUrl}/devices/${deviceId}/readings`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceReportReadings(userId, deviceId, query) {
    const url = `${this.esUrl}/devices/${deviceId}/readings/report`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }
}

module.exports = Delorean;
