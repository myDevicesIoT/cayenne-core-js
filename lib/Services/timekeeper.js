const Request = require('./../Request');

class Timekeeper extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {object} [options]
   */
  constructor(url, token, options = {}) {
    super(Timekeeper.name, url, token, options);
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   */
  getJobs(applicationId, userId) {
    const path = `/jobs`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} jobId
   */
  getJob(applicationId, userId, jobId) {
    const path = `/jobs/${jobId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /**
   * @param {string}   applicationId
   * @param {string}   userId
   * @param {Object}   payload
   * @param {string}   payload.title
   * @param {Object[]} [payload.actions]
   */
  createJob(applicationId, userId, payload) {
    const path = `/jobs`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} jobId
   * @param {Object} payload
   */
  updateJob(applicationId, userId, jobId, payload) {
    const path = `/jobs/${jobId}`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('PUT', path, { payload });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} jobId
   * @param {string} state
   */
  toggleJob(applicationId, userId, jobId, state) {
    const path = `/jobs/${jobId}/${state}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('PUT', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} jobId
   */
  deleteJob(applicationId, userId, jobId) {
    const path = `/jobs/${jobId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }
}

module.exports = Timekeeper;
