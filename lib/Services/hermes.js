class Hermes {
  /**
   * @param {String} url
   * @param {typeof Auth} Auth
   */
  constructor(url, Auth) {
    this.service = Hermes.name;
    this.url = url;
    this.auth = Auth;
  }

  /**
   * @param {String}  userId
   * @param {Object}  payload         Hermes paylaod to send
   * @param {String}  payload.type    Notification template to send
   * @param {String}  payload.method  Notification type to send (sms/email)
   * @param {String}  payload.to      Receipient of notification
   * @param {Object}  payload.data    Data to populate template with
   */
  sendNotification(userId, payload) {
    const url = `${this.url}/notify`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * @param {Object}  payload         Hermes paylaod to send
   * @param {String}  payload.ts      Timestamp
   * @param {String}  payload.service Service
   * @param {String}  payload.uid     UID
   */
  pauseNotification(payload) {
    const url = `${this.url}/notify/pause`;
    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * Verifies the application's notification settings.
   */
  verify() {
    const url = `${this.url}/notify/verify`;
    return this.auth.send(this.service, 'POST', url, {});
  }

  /**
   * Gets notification logs
   * @param {String}    userId
   * @param {Object}    query                 How to query notification logs
   * @param {String}    query.type            Type of query to perform
   * @param {String}    [query.startDate]     Start date of a custom type query
   * @param {String}    [query.endDate]       End date of a custom type query
   * @param {String}    [query.limit]         Max limit to return
   * @param {Object[]}  [query.filters]       Additional key, value, operation filters
   * @param {String}    query.filters[].key   Key value of notification log object
   * @param {String}    query.filters[].value Value to search for
   * @param {String}    query.filters[].op    Operation to perform on key
   */
  getLogs(userId, query) {
    const url = `${this.url}/logs`;
    query = { ...query, user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Gets email tempaltes
   */
  getEmailTemplates() {
    const url = `${this.url}/email/templates`;

    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Create an email template
   *
   * @param {Object} payload
   * @param {String} payload.type
   * @param {String} payload.blob
   * @param {String} payload.from
   * @param {String} [payload.subject]
   */
  createEmailTemplate(payload) {
    const url = `${this.url}/email/templates`;

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * Gets SMS templates
   */
  getSMSTemplates() {
    const url = `${this.url}/sms/templates`;

    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Create an SMS template
   *
   * @param {Object} paylaod
   * @param {String} payload.type
   * @param {String} payload.blob
   */
  createSMSTemplate(payload) {
    const url = `${this.url}/sms/templates`;

    return this.auth.send(this.service, 'POST', url, { payload });
  }
}

module.exports = Hermes;
