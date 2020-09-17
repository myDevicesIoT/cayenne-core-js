const Request = require('./../Request');

class Hermes extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {Object} [options]
   */
  constructor(url, token, options = {}) {
    super(Hermes.name, url, token, options);
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {Object} payload        Hermes payload to send
   * @param {string} payload.type   Notification template to send
   * @param {string} payload.method Notification type to send (sms/email)
   * @param {string} payload.to     Recipient of notification
   * @param {Object} payload.data   Data to populate template with
   */
  sendNotification(applicationId, userId, payload) {
    const path = `/notify`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * @param {Object} payload         Hermes payload to send
   * @param {string} payload.ts      Timestamp
   * @param {string} payload.service Service
   * @param {string} payload.uid     UID
   */
  pauseNotification(payload) {
    const path = `/notify/pause`;
    return this.send('POST', path, { payload });
  }

  /**
   * Verifies the application's notification settings.
   *
   * @param {string} applicationId
   */
  verify(applicationId) {
    const path = `/notify/verify`;
    const query = this.setTenant(applicationId);

    return this.send('POST', path, { query });
  }

  /**
   * @param {Object} payload         Hermes payload to send
   * @param {string} payload.type    Type: 'accountId', 'applicationId', 'recipient'
   * @param {string} payload.value   either one from: user account id, application id, or recipient: email/phone
   */
  createBlacklist(payload) {
    const path = `/v1.1/blacklist`;
    return this.send('POST', path, { payload });
  }

  /**
   * @param {Object} payload                        Hermes payload to send
   * @param {string} payload.params.query           Hermes query to send
   * @param {number} payload.params.query.limit     Optional, default is 10
   * @param {string} payload.params.query.order_dir Optional one of: 'asc', 'desc'
   * @param {string} payload.params.query.type      'accountId', 'applicationId', 'recipient'
   * @param {string} payload.params.query.value     either one from: user account id, application id, or recipient: email/phone
   */
  getBlacklistEntries(params) {
    const path = `/v1.1/blacklist/entries`;
    return this.send('GET', path, params);
  }

  /**
   * Deletes the blacklist entry
   *
   * @param {string} id
   */
  deleteBlacklistEntry(id) {
    const path = `/v1.1/blacklist/${id}`;
    return this.send('DELETE', path);
  }

  /**
   * Gets notification logs
   * @param {string}   applicationId
   * @param {string}   userId
   * @param {Object}   query                 How to query notification logs
   * @param {string}   query.type            Type of query to perform
   * @param {string}   [query.startDate]     Start date of a custom type query
   * @param {string}   [query.endDate]       End date of a custom type query
   * @param {string}   [query.limit]         Max limit to return
   * @param {Object[]} [query.filters]       Additional key, value, operation filters
   * @param {string}   query.filters[].key   Key value of notification log Object
   * @param {string}   query.filters[].value Value to search for
   * @param {string}   query.filters[].op    Operation to perform on key
   */
  getLogs(applicationId, userId, query) {
    const path = `/v1.1/logs`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, { query });
  }

  /**
   * Destoy all notification logs for a user
   * @param {string} applicationId
   * @param {String} userId
   */
  deleteLogs(applicationId, userId) {
    const path = `/v1.1/logs`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * Gets email templates.
   * @param {string} applicationId
   */
  getEmailTemplates(applicationId) {
    const path = `/email/templates`;
    const query = this.setTenant(applicationId);

    return this.send('GET', path, { query });
  }

  /**
   * Create an email template
   *
   * @param {string} applicationId
   * @param {Object} payload
   * @param {string} payload.type
   * @param {string} payload.blob
   * @param {string} payload.from
   * @param {string} [payload.subject]
   */
  createEmailTemplate(applicationId, payload) {
    const path = `/email/templates`;
    const query = this.setTenant(applicationId);

    return this.send('POST', path, { payload, query });
  }

  /**
   * Gets SMS templates
   * @param {string} applicationId
   */
  getSMSTemplates(applicationId) {
    const path = `/sms/templates`;
    const query = this.setTenant(applicationId);

    return this.send('GET', path, { query });
  }

  /**
   * Create an SMS template
   *
   * @param {string} applicationId
   * @param {Object} payload
   * @param {string} payload.type
   * @param {string} payload.blob
   */
  createSMSTemplate(applicationId, payload) {
    const path = `/sms/templates`;
    const query = this.setTenant(applicationId);

    return this.send('POST', path, { payload, query });
  }

  /**
   * @param {Object} payload
   * @param {Object} opts
   */
  migrateUser(payload, opts) {
    const path = `/move/users`;
    opts = { response: 60000, deadline: 90000, ...opts };
    opts.payload = payload;
    return this.send('POST', path, opts);
  }
}

module.exports = Hermes;
