class DeloreanES {
  /**
   * @param {String} url
   * @param {typeof Auth} Auth
   */
  constructor(url, Auth) {
    this.service = DeloreanES.name;
    this.url = url;
    this.auth = Auth;
  }

  /**
   * get latest checkin timestamp of deviceId
   *  sensors - get sensors or not
   *
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {boolean} getSensors
   * @param {Array}   channels
   */
  getDeviceCheckIn(userId, deviceId, needSensors, channels) {
    const url = `${this.url}/devices/${deviceId}/checkin`;
    const query = { user_id: userId, sensors: needSensors, channels: channels };
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
    const url = `${this.url}/devices/${deviceId}/state`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {String}  channel
   * @param {Object}  query
   * @param {String}  query.event
   * @param {String}  query.units
   */
  getChannelState(userId, deviceId, channel, query) {
    const url = `${this.url}/devices/${deviceId}/channels/${channel}/state`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceIds
   * @param {Object}  query
   */
  getDevicesState(userId, deviceIds, query) {
    const url = `${this.url}/devices/state`;
    query = { ...query, user_id: userId, devices: deviceIds };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceTotals(userId, deviceId, query) {
    const url = `${this.url}/devices/${deviceId}/totals`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceAggregations(userId, deviceId, query) {
    const url = `${this.url}/devices/${deviceId}/aggregations`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceReadings(userId, deviceId, query) {
    const url = `${this.url}/devices/${deviceId}/readings`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceReportReadings(userId, deviceId, query) {
    const url = `${this.url}/devices/${deviceId}/readings/report`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  deviceId
   * @param {Object}  payload
   */
  postDownloadRequest(deviceId, payload) {
    const url = `${this.url}/devices/${deviceId}/readings/download`;
    return this.auth.send(this.service, 'POST', url, { payload });
  }
}

module.exports = DeloreanES;
