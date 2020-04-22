class Timekeeper {
  /**
   * @param {String} url
   * @param {Auth} Auth
   */
  constructor(url, Auth) {
    this.service = Timekeeper.name;
    this.url = url;
    this.auth = Auth;
  }

  /**
   * @param {String}  userId
   */
  getJobs(userId) {
    const url = `${this.url}/jobs`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   */
  getJob(userId, jobId) {
    const url = `${this.url}/jobs/${jobId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}    userId
   * @param {Object}    payload
   * @param {String}    payload.title
   * @param {Object[]}  [payload.actions]
   */
  createJob(userId, payload) {
    const url = `${this.url}/jobs`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   * @param {Object}  payload
   */
  updateJob(userId, jobId, payload) {
    const url = `${this.url}/jobs/${jobId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', url, { payload, query });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   * @param {String}  state
   */
  toggleJob(userId, jobId, state) {
    const url = `${this.url}/jobs/${jobId}/${state}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  jobId
   */
  deleteJob(userId, jobId) {
    const url = `${this.url}/jobs/${jobId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'DELETE', url, { query });
  }


  /**
   * @param {String} userId
   */
  deleteJobs(userId){
    const url = `${this.url}/jobs`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'DELETE', url, { query });
  }
}

module.exports = Timekeeper;
