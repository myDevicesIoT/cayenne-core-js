const superagent = require('superagent');

const CoreError = require('./CoreError');

/**
 * Request sends requests to the Cayenne Core services.
 */
class Request {
  /**
   * Constructs the Cayenne Core Requester.
   *
   * @param {string}                      service
   * @param {string}                      url
   * @param {string}                      token
   * @param {Object}                      [options={}]     Additional options
   * @param {Function | Object | Boolean} [options.logger] Debug, info, and error logger to use
   * @param {ICache}                      [options.cache]  Optional cache instantiated class
   */
  constructor(service, url, token, options = {}) {
    if (!service || !url || !token) {
      throw CoreError.InvalidConfiguration();
    }

    this.service = `[${service}]`;
    this.url = url;
    this.token = token;
    this.invalidCredentials = false;
    this.logger = options.logger;

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

    this.defaultResponse = 60000;
    this.defaultDeadline = 90000;
  }

  /**
   * Send a request to Core service
   *
   * @public
   *
   * @param {String}  method                ReST method to use
   * @param {string}  path                  Path to target
   * @param {Object}  opts                  Additional options
   * @param {Object}  [opts.headers={}]     Headers to send
   * @param {Object}  [opts.query]          Query to send
   * @param {Object}  [opts.payload]        Payload to send
   * @param {boolean} [opts.isPublic=false] If this request should include authorization
   * @param {Object}  [opts.cache=false]
   * @param {String}  opts.cache.key
   * @param {String}  opts.cache.action
   * @param {Boolean} opts.cache.onNotFound
   * @param {Object}  [opts.error = {}]     Error options
   *
   * @returns {Promise<{} | Array<{}>>}
   *
   * @throws {CoreError} Returns error or max authenticated request limit reached
   */
  async send(method, path, opts) {
    let trace = {};
    Error.captureStackTrace(trace, this.send);
    trace.stack = trace.stack
      .split('\n')
      .splice(1)
      .join('\n');

    opts = Object.assign(
      {
        headers: {},
        isPublic: false,
        cache: false,
        response: this.defaultResponse,
        deadline: this.defaultDeadline,
        error: {},
        stream: false
      },
      opts
    );

    let begin = new Date().getTime();
    const url = `${this.url}${path}`;

    try {
      if (this.invalidCredentials) {
        throw this.invalidCredentials;
      }

      if (!opts.isPublic) {
        opts.headers.authorization = this.token;
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
        const req = superagent(method, url)
          .set(opts.headers)
          .timeout({
            response: opts.response,
            deadline: opts.deadline
          })
          .query(opts.query);

        if (opts.stream) {
          return req.send(opts.payload).pipe(opts.stream);
        }

        begin = new Date().getTime();
        ({ status, body } = await req.send(opts.payload));

        if (
          this.isCacheEnabled &&
          opts.cache &&
          opts.cache.action === this.cache.actions.get
        ) {
          await this.executeCacheOp({
            value: body,
            ...opts.cache,
            action: this.cache.actions.set
          });
        }
      }

      if (this.isCacheEnabled && body === false) {
        throw CoreError.CachedNotFound();
      }

      this.log(
        `${this.service} ${method}, code: ${status}, t: ${this.timeDelta(
          begin
        )} ms -> url: ${url}, query: ${JSON.stringify(opts.query || {})}`
      );

      return body;
    } catch (error) {
      error.stack = [error.stack, trace.stack].join('\n');

      if (
        this.isCacheEnabled &&
        opts.cache &&
        opts.cache.action === this.cache.actions.get &&
        opts.cache.onNotFound &&
        error.status === 404 &&
        !(
          error instanceof CoreError &&
          error.typeof.name === CoreError.CachedNotFound.name
        )
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
        !(
          error instanceof CoreError &&
          error.typeof &&
          error.typeof.name === CoreError.InvalidCredentials.name
        )
      ) {
        this.invalidCredentials = CoreError.InvalidCredentials();
        error = this.invalidCredentials;
      }

      throw this.getError(
        error,
        method,
        url,
        this.timeDelta(begin),
        opts.query,
        opts.error
      );
    }
  }

  /**
   * Create the Core Error and log it
   *
   * @private
   *
   * @param {typeof Error} error             Error returned
   * @param {String}       method            REST method used
   * @param {String}       url               Endpoint
   * @param {Number}       tDelta            Request time in ms
   * @param {Object}       query             The query sent
   * @param {Object}       opts              Additional options
   * @param {Boolean}      [opts.mute=false] Whether to mute the error log
   *
   * @returns {CoreError}
   */
  getError(error, method, url, tDelta, query, opts = {}) {
    opts = { mute: false, ...opts };

    const errorText =
      !!error.response && !!error.response.text
        ? error.response.text
        : error instanceof CoreError && (error.isInternal || error.isCache)
        ? error.typeof.name
        : `${error.name}: ${error.message}`;

    if (!opts.mute) {
      this.log(
        `${this.service} ${method}, code: ${
          error.isCache ? 'CACHED' : error.status
        }, t: ${tDelta} ms -> url: ${url}, query: ${JSON.stringify(
          query || {}
        )} -> error response ${errorText}`,
        'error'
      );
    }

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
   * @param {String} prefix                 Additional prefix to add
   * @param {Array.<Number | String>}  rest Rest of values to add to keys, only number or strings
   *
   * @returns {String}
   */
  genCacheKey(prefix, ...rest) {
    let key = rest
      .map(arg => {
        if (typeof arg === 'string' || typeof arg === 'number') {
          return `${arg}`;
        }
        return '';
      })
      .join('...');

    return [this.clientId, this.service, prefix, key].join('.');
  }

  /**
   * Sets the tenant for object.
   *
   * @param {string} applicationId
   * @param {string} userId
   * @param {object} [dst={}]
   */
  setTenant(applicationId, userId, dst = {}) {
    if (applicationId) {
      dst.application_id = applicationId;
    }
    if (userId) {
      dst.user_id = userId;
    }
    return dst;
  }
}

module.exports = Request;
