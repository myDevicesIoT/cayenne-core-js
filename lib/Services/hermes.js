const Request = require('./../Request');

class Hermes extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {object} [options]
   */
  constructor(url, token, options = {}) {
    super(Hermes.name, url, token, options);
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
    const path = `/notify`;
    payload.user_id = userId;

    return this.send('POST', path, { payload });
  }

  /**
   * @param {Object}  payload         Hermes paylaod to send
   * @param {String}  payload.ts      Timestamp
   * @param {String}  payload.service Service
   * @param {String}  payload.uid     UID
   */
  pauseNotification(payload) {
    const path = `/notify/pause`;
    return this.send('POST', path, { payload });
  }

  /**
   * Verifies the application's notification settings.
   */
  verify() {
    const path = `/notify/verify`;
    return this.send('POST', path, {});
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
    const path = `/logs`;
    query = { ...query, user_id: userId };

    return this.send('GET', path, { query });
  }

  /**
   * Gets email tempaltes
   */
  getEmailTemplates() {
    const path = `/email/templates`;

    return this.send('GET', path);
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
    const path = `/email/templates`;

    return this.send('POST', path, { payload });
  }

  /**
   * Gets SMS templates
   */
  getSMSTemplates() {
    const path = `/sms/templates`;

    return this.send('GET', path);
  }

  /**
   * Create an SMS template
   *
   * @param {Object} paylaod
   * @param {String} payload.type
   * @param {String} payload.blob
   */
  createSMSTemplate(payload) {
    const path = `/sms/templates`;

    return this.send('POST', path, { payload });
  }
}

module.exports = Hermes;
