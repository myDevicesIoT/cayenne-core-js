const superagent = require('superagent');

const CoreError = require('./../CoreError');
const Token = require('./token');

/**
 * Auth provides the client credential token handling for the Cayenne Core services
 */
class Auth {
  /**
   * Constructs the Cayenne Core authenticator
   *
   * @param {String}                      clientId                 Cayenne Core client id
   * @param {String}                      clientSecret             Cayenne Core client secret
   * @param {String}                      [authorizationUrl]       Authorization URL to authenticate against
   * @param {Object}                      [options={}]             Additional options
   * @param {Function | Object | Boolean} [options.logger]         Debug, info, and error logger to use
   * @param {Boolean}                     [options.isOffline=true] Provides a session that can be used indefinitely by refreshing
   * @param {ICache}                      [options.cache]          Optional cache instantiated class
   */
  constructor(clientId, clientSecret, authorizationUrl, options = {}) {
    /**
     * Constants
     */
    /** @private @contant */
    this.OFFLINE_SCOPE = 'offline_access';
    /** @private @contant */
    this.MAX_RETRIES = 1;
    /** @private @contant */
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

    this.isCacheEnabled = !!options.cache;
    this.cache = {
      interface: options.cache,
      actions: {
        drop: 'drop',
        get: 'get',
        set: 'set'
      },
      status: 'cached'
    };

    /** @type CoreError */
    this.invalidCredentials;
    this.access = new Token();
  }

  /**
   * Get authorization token
   *
   * @private
   *
   * @param {Number} [retry] Current retry count
   *
   * @returns {Promise<String>} Valid access token
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
   * Send a request to Core service
   *
   * @public
   *
   * @param {String}  service               Core service being requested
   * @param {String}  method                ReST method to use
   * @param {String}  url                   Full cayenne core path
   * @param {Object}  opts                  Additional options
   * @param {Object}  [opts.headers={}]     Headers to send
   * @param {Object}  [opts.query]          Query to send
   * @param {Object}  [opts.payload]        Payload to send
   * @param {boolean} [opts.isPublic=false] If this request should include authorization
   * @param {Object}  [opts.cache=false]
   * @param {String}  opts.cache.key
   * @param {String}  opts.cache.action
   * @param {Boolean} opts.cache.onNotFound
   * @param {Number}  retry                 Allow retries in case of expired token
   *
   * @returns {Promise<{} | Array<{}>>}
   *
   * @throws {CoreError} Returns erroror max authenticated request limit reached
   */
  async send(service, method, url, opts, retry = 0) {
    if (this.invalidCredentials) {
      throw this.invalidCredentials;
    }

    opts = Object.assign({ headers: {}, isPublic: false, cache: false }, opts);

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

      let status;
      let body;
      if (this.isCacheEnabled && opts.cache) {
        if (opts.cache.action === this.cache.actions.drop) {
          await this.executeCacheOp(opts.cache);
        }
        if (opts.cache.action === this.cache.actions.get) {
          body = await this.executeCacheOp(opts.cache);
          status = body || body === false ? this.cache.status : null;
        }
      }

      if (!body && body !== false) {
        if (!opts.isPublic) {
          const clientToken = await this.getApplicationToken();
          opts.headers.authorization = `Bearer ${clientToken}`;
        }

        begin = new Date().getTime();
        ({ status, body } = await superagent(method, url)
          .set(opts.headers)
          .query(opts.query)
          .send(opts.payload));

        if (
          this.isCacheEnabled &&
          opts.cache &&
          opts.cache.action === this.cache.actions.get
        ) {
          await this.executeCacheOp({
            value: body,
            ...opts.cache,
            ...{ action: this.cache.actions.set }
          });
        }
      }

      if (this.isCacheEnabled && body === false) {
        throw CoreError.CachedNotFound();
      }

      this.log(
        `${service} ${method}, code: ${status}, t: ${this.timeDelta(
          begin
        )} ms -> url: ${url}, query: ${JSON.stringify(opts.query || {})}`
      );

      return body;
    } catch (error) {
      if (
        this.isCacheEnabled &&
        opts.cache &&
        opts.cache.action === this.cache.actions.get &&
        opts.cache.onNotFound &&
        error.status === 404 &&
        error.typeof !== CoreError.CachedNotFound
      ) {
        await this.executeCacheOp({
          value: false,
          ...opts.cache,
          ...{ action: this.cache.actions.set }
        });
      }

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
   * Create the Core Error and log it
   *
   * @private
   *
   * @param {typeof Error} error   Error returned
   * @param {String}       url     Endpoint
   * @param {String}       service Core service requested
   * @param {String}       method  REST method used
   * @param {Number}       tDelta  Request time in ms
   * @param {Object}       query   The query sent
   *
   * @returns {CoreError}
   */
  getError(error, url, service, method, tDelta, query) {
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

    if (error instanceof CoreError) {
      return error;
    }

    error = new CoreError(error, { statusCode: error.status });
    return error;
  }

  /**
   * Returns timedelta in ms
   *
   * @private
   *
   * @param {Number} begin ms
   *
   * @returns {Number}
   */
  timeDelta(begin) {
    return new Date().getTime() - begin;
  }

  /**
   * Log the message if enabled and with applicable log level
   *
   * @public
   *
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

  /**
   * Executes a cache operations
   *
   * @param {Object} [opts]
   * @param {String} opts.key
   * @param {{}}     opts.value
   * @param {String} opts.action
   * @param {Array}  rest
   */
  executeCacheOp(opts, ...rest) {
    if (!this.isCacheEnabled) {
      return;
    }

    switch (opts.action) {
      case this.cache.actions.get:
        return this.cache.interface.get(opts.key, ...rest);
      case this.cache.actions.set:
        return this.cache.interface.set(opts.key, opts.value, ...rest);
      case this.cache.actions.drop:
        return this.cache.interface.drop(opts.key, ...rest);
      default:
        throw new CoreError('Unknown cache operation');
    }
  }

  /**
   * Generates a cache key
   *
   * @param {String} service                Service prefix to add
   * @param {String} prefix                 Additoinal prefix to add
   * @param {Array.<Number | String>}  rest Rest of values to add to keys, only number or strings
   *
   * @returns {String}
   */
  genCacheKey(service, prefix, ...rest) {
    let key = rest
      .map(arg => {
        if (typeof arg === 'string' || typeof arg === 'number') {
          return `${arg}`;
        }
        return '';
      })
      .join('...');

    return [this.clientId, service, prefix, key].join('.');
  }
}

module.exports = Auth;
