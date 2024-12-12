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
   * Get device's latest check in timestamp.
   *
   * @param {string}  userId
   * @param {string}  deviceId
   * @param {boolean} sensors  Whether to include sensors.
   * @param {Array}   channels
   */
  getDeviceCheckIn(applicationId, userId, deviceId, sensors, channels) {
    const path = `/devices/${deviceId}/checkin`;
    const query = this.setTenant(applicationId, userId, { sensors, channels });

    return this.send('GET', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   * @param {string} query.type
   * @param {string} query.units
   */
  getDeviceState(applicationId, userId, deviceId, query) {
    const path = `/devices/${deviceId}/state`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {string} channel
   * @param {Object} query
   * @param {string} query.event
   * @param {string} query.units
   */
  getChannelState(applicationId, userId, deviceId, channel, query) {
    const path = `/devices/${deviceId}/channels/${channel}/state`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceIds
   * @param {Object} query
   */
  getDevicesState(applicationId, userId, deviceIds, query) {
    const path = `/devices/state`;
    query = this.setTenant(applicationId, userId, {
      ...query,
      devices: deviceIds
    });

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   */
  getDeviceTotals(applicationId, userId, deviceId, query) {
    const path = `/devices/${deviceId}/totals`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   */
  getDeviceAggregations(applicationId, userId, deviceId, query) {
    const path = `/devices/${deviceId}/aggregations`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   */
  getDeviceChart(applicationId, userId, deviceId, query) {
    const path = `/devices/${deviceId}/chart`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   */
  getDeviceReadings(applicationId, userId, deviceId, query) {
    const path = `/devices/${deviceId}/readings`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   */
  getDeviceReportReadings(applicationId, userId, deviceId, query) {
    const path = `/devices/${deviceId}/readings/report`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   */
  getUnits(applicationId, userId, deviceId, query) {
    const path = `/devices/${deviceId}/readings/units`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} query
   * @param {Object} stream
   */
  getDeviceReportStream(applicationId, userId, deviceId, query, stream) {
    const path = `/devices/${deviceId}/stream/report`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, {
      query,
      stream,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {Object} payload
   */
  postDownloadRequest(applicationId, userId, deviceId, payload) {
    const path = `/devices/${deviceId}/readings/download`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * @param {Object} payload
   * @param {Object} opts
   */
  migrateUser(payload, opts) {
    const path = `/move/users`;
    opts = { response: 900000 * 3, deadline: 900000 * 3, ...opts };
    opts.payload = payload;
    return this.send('POST', path, opts);
  }

  /**
   * @param {Object} payload
   * @param {Object} ops
   */
  replaceUsers(payload, opts) {
    const path = `/replace/users`;
    opts = { response: 900000 * 3, deadline: 900000 * 3, ...opts };
    opts.payload = payload;
    return this.send('POST', path, opts);
  }
}

module.exports = DeloreanES;
