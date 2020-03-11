const Request = require('./../Request');

class DeloreanES extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {object} [options]
   */
  constructor(url, token, options = {}) {
    super(DeloreanES.name, url, token, options);
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
    const path = `/devices/${deviceId}/checkin`;
    const query = { user_id: userId, sensors: needSensors, channels: channels };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   * @param {String}  query.type
   * @param {String}  query.units
   */
  getDeviceState(userId, deviceId, query) {
    const path = `/devices/${deviceId}/state`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
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
    const path = `/devices/${deviceId}/channels/${channel}/state`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceIds
   * @param {Object}  query
   */
  getDevicesState(userId, deviceIds, query) {
    const path = `/devices/state`;
    query = { ...query, user_id: userId, devices: deviceIds };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceTotals(userId, deviceId, query) {
    const path = `/devices/${deviceId}/totals`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceAggregations(userId, deviceId, query) {
    const path = `/devices/${deviceId}/aggregations`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceReadings(userId, deviceId, query) {
    const path = `/devices/${deviceId}/readings`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getDeviceReportReadings(userId, deviceId, query) {
    const path = `/devices/${deviceId}/readings/report`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   */
  getUnits(userId, deviceId, query) {
    const path = `/devices/${deviceId}/readings/units`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  query
   * @param {Object}  stream
   */
  getDeviceReportStream(userId, deviceId, query, stream) {
    const path = `/devices/${deviceId}/stream/report`;
    query = { ...query, user_id: userId };

    return this.send('GET', path, {
      query,
      stream,
      response: 90000 * 3,
      timeout: 90000 * 3
    });
  }

  /**
   * @param {String}  userId
   * @param {String}  deviceId
   * @param {Object}  payload
   */
  postDownloadRequest(userId, deviceId, payload) {
    const path = `/devices/${deviceId}/readings/download`;
    payload = { ...payload, user_id: userId };
    return this.send('POST', path, { payload });
  }
}

module.exports = DeloreanES;
