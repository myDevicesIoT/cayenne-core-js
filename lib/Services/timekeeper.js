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
   * @param {String}  userId
   */
  getJobs(userId) {
    const path = `/jobs`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   */
  getJob(userId, jobId) {
    const path = `/jobs/${jobId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', path, { query });
  }

  /**
   * @param {String}    userId
   * @param {Object}    payload
   * @param {String}    payload.title
   * @param {Object[]}  [payload.actions]
   */
  createJob(userId, payload) {
    const path = `/jobs`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'POST', path, { payload });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   * @param {Object}  payload
   */
  updateJob(userId, jobId, payload) {
    const path = `/jobs/${jobId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', path, { payload, query });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   * @param {String}  state
   */
  toggleJob(userId, jobId, state) {
    const path = `/jobs/${jobId}/${state}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   */
  deleteJob(userId, jobId) {
    const path = `/jobs/${jobId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'DELETE', path, { query });
  }
}

module.exports = Timekeeper;
