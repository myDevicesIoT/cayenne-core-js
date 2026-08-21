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
   * Get lightweight map state (GPS + timestamp) for multiple devices.
   * Uses ES msearch for a single round-trip.
   *
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceIds  Comma-separated device IDs
   * @returns {Promise<Array<{thing_id, timestamp, geo}>>}
   */
  getDevicesMapState(applicationId, userId, deviceIds) {
    const path = `/devices/map-state`;
    const query = this.setTenant(applicationId, userId, {
      devices: deviceIds
    });

    return this.send('GET', path, {
      query,
      response: 900000 * 3,
      timeout: 900000 * 3
    });
  }

  /**
   * Get map state for multiple devices with the latest reading per requested
   * channel, plus batched gateway checkin state. Single ES round-trip each.
   *
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceIds  Comma-separated device IDs
   * @param {Object} [options]
   * @param {string} [options.channels]  Comma-separated channels, ex: '102,103,104,105,7'
   * @param {string} [options.gateways]  Comma-separated gateway device IDs
   * @param {string} [options.units]     Display units aligned with devices, pipe-delimited per device, ex: 'c|mm,f'
   * @returns {Promise<{devices: Array<{thing_id, timestamp, geo, readings}>, gateways: Array<{thing_id, timestamp, state}>}>}
   */
  getDevicesMapStateV2(applicationId, userId, deviceIds, options = {}) {
    const path = `/devices/map-state`;
    const { channels, gateways, units } = options;
    const query = this.setTenant(applicationId, userId, {
      ...(deviceIds ? { devices: deviceIds } : {}),
      ...(channels ? { channels } : {}),
      ...(gateways ? { gateways } : {}),
      ...(units ? { units } : {})
    });

    return this.send('GET', path, {
      query,
      response: 30000,
      timeout: 30000
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
