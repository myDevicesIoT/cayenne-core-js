const superagent = require('superagent');

const CoreError = require('./../CoreError');
const Token = require('./token');

/**
 * Cayenne Core Auth Class
 */
class Auth {
  /**
   * Constructs the Cayenne Core authenticator
   *
   * @param {String}                      clientId
   * @param {String}                      clientSecret
   * @param {String}                      [authorizationUrl]
   * @param {Object}                      options
   * @param {Function | Object | Boolean} [options.logger]
   * @param {Boolean}                     [options.isOffline=true]
   */
  constructor(clientId, clientSecret, authorizationUrl, options) {
    /**
     * Constants
     */
    this.OFFLINE_SCOPE = 'offline_access';
    this.MAX_RETRIES = 1;
    this.DEFAULT_AUTHORIZATION_URL =
      'https://accounts.mydevices.com/auth/realms/cayenne-core/protocol/openid-connect/token';

    options = Object.assign({ isOffline: true }, options);

    if (!clientId || !clientSecret) {
      throw CoreError.InvalidApplicationCredentials();
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authUrl = authorizationUrl || this.DEFAULT_AUTHORIZATION_URL;
    this.logger = options.logger;
    this.isOffline = options.isOffline;

    this.invalidCredentials;
    this.access = new Token();
  }

  /**
   * @function
   * @private
   *
   * Get authorization token
   *
   * @param {Number} [retry] Current retry count
   * @returns {Promise} Valid access token
   */
  async getApplicationToken(retry = 0) {
    if (retry > this.MAX_RETRIES) {
      throw CoreError.MaxAuthenticationRequestsReached();
    }
    if (this.invalidCredentials) {
      throw this.invalidCredentials;
    }

    let grantType;
    if (this.access.token && this.access.isExpired()) {
      grantType = 'refresh_token';
    } else if (this.access.token && this.access.failed) {
      grantType = 'client_credentials';
    } else if (this.access.token && !this.access.isExpired()) {
      return this.access.token;
    } else {
      grantType = 'client_credentials';
    }

    const payload = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: grantType
    };

    if (this.isOffline) {
      payload.scope = this.OFFLINE_SCOPE;
    }

    if (grantType === 'refresh_token') {
      payload.refresh_token = this.access.refresh;
    }

    const response = await this.send(
      `auth-${grantType}`,
      'POST',
      this.authUrl,
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        payload,
        isPublic: true
      }
    ).catch(error => {
      if (error.status === 400 && grantType === 'refresh_token') {
        this.access = new Token();
        return this.getApplicationToken(++retry);
      } else if (
        error.status === 400 &&
        grantType === 'client_credentials' &&
        !this.access.token
      ) {
        this.invalidCredentials = CoreError.InvalidApplicationCredentials();
        throw this.invalidCredentials;
      }

      throw error;
    });

    this.access = new Token(response.access_token, response.refresh_token);

    return this.access.token;
  }

  /**
   * @function
   * @public
   *
   * Send a request to Core service
   *
   * @param {String} service Core service being requested
   * @param {String} method ReST method to use
   * @param {String} url Endpoint
   * @param {Object} opts Additional options
   * @param {Object} [opts.headers={}] Headers to send
   * @param {Object} [opts.query] Query to send
   * @param {Object} [opts.payload] Payload to send
   * @param {boolean} [opts.isPublic=false] If this request should include authorization
   * @param {Number} retry Allow retries in case of expired token
   */
  async send(service, method, url, opts, retry = 0) {
    if (this.invalidCredentials) {
      throw this.invalidCredentials;
    }

    opts = Object.assign({ headers: {}, isPublic: false }, opts);

    if (!retry) {
      service = `[${service}]`;
      if (opts.isPublic) {
        service += ' PUBLIC';
      }
    }

    let begin = new Date().getTime();
    try {
      if (retry > this.MAX_RETRIES) {
        throw CoreError.MaxAuthenticatedRequestsReached();
      }

      if (!opts.isPublic) {
        const clientToken = await this.getApplicationToken();
        opts.headers.authorization = `Bearer ${clientToken}`;
      }

      begin = new Date().getTime();
      const response = await superagent(method, url)
        .set(opts.headers)
        .query(opts.query)
        .send(opts.payload);

      this.log(
        `${service} ${method}, code: ${response.status}, t: ${this.timeDelta(
          begin
        )} ms -> url: ${url}, query: ${JSON.stringify(opts.query || {})}`
      );

      return response.body;
    } catch (error) {
      if (
        !opts.isPublic &&
        error.status === 401 &&
        error.typeof !== CoreError.MaxAuthenticatedRequestsReached
      ) {
        this.access.failed = true;
        return this.send(service, method, url, opts, ++retry);
      }

      throw this.getError(
        error,
        url,
        service,
        method,
        this.timeDelta(begin),
        opts.query
      );
    }
  }

  /**
   * @function
   * @private
   *
   * Create the Core Error and log it
   *
   * @param {typeof Error} error Error returned
   * @param {String} url Endpoint
   * @param {String} service Core service requested
   * @param {String} method REST method used
   * @param {Number} tDelta Request time in ms
   * @param {Object} query The query sent
   */
  getError(error, url, service, method, tDelta, query) {
    const log = () => {
      const errorText =
        !!error.response && !!error.response.text
          ? error.response.text
          : error.stack;
      this.log(
        `${service} ${method}, code: ${
          error.status
        }, t: ${tDelta} ms -> url: ${url}, query: ${JSON.stringify(
          query || {}
        )} -> error response ${errorText}`,
        'error'
      );
    };

    if (error instanceof CoreError) {
      log();
      return error;
    }

    error = new CoreError(error, { statusCode: error.status });
    log();
    return error;
  }

  /**
   * @function
   * @private
   *
   * Returns timedelta in ms
   *
   * @param {Number} begin ms
   */
  timeDelta(begin) {
    return new Date().getTime() - begin;
  }

  /**
   * @function
   * @public
   *
   * Log the message if enabled and with applicable log level
   * @param {String} message
   * @param {String} level
   */
  log(message, level) {
    if (typeof this.logger === 'boolean' && !this.logger) {
      return;
    }

    const logLevel = level || 'verbose';

    if (
      typeof this.logger === 'object' &&
      typeof this.logger[logLevel] === 'function'
    ) {
      this.logger[logLevel](message);
      return;
    }

    if (typeof this.logger === 'function') {
      this.logger(`[cayenne-core] ${message}`);
      return;
    }
  }
}

module.exports = Auth;
