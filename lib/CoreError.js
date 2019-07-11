const Boom = require('boom');

class CoreError extends Boom {
  static [Symbol.hasInstance](instance) {
    return CoreError.isCore(instance);
  }

  static isCore(err) {
    return err instanceof Error && !!err.isCore;
  }

  /**
   * @param {String | Error} message
   * @param {Object} [options]
   */
  constructor(message, options) {
    options = Object.assign({}, options);

    const { ctr = CoreError, isInternal = false } = options;
    if (message && !message.isBoom && message instanceof Error) {
      message.name = `${CoreError.name} - ${message.name}`;
    }

    super(message ? message : undefined, options);

    if (typeof message === 'string' || !this.isServer) {
      Error.captureStackTrace(this, ctr);
    } else {
      this.message = 'Internal error';
    }

    this.name = CoreError.name;
    this.isCore = true;
    this.status = this.output.statusCode;
    this.typeof = ctr;
    this.isInternal = isInternal;

    return this;
  }

  static InvalidApplicationCredentials() {
    return this.unauthorized(this.InvalidApplicationCredentials.name, {
      ctr: this.InvalidApplicationCredentials,
      isInternal: true
    });
  }

  static MaxAuthenticationRequestsReached() {
    return this.unauthorized(this.MaxAuthenticationRequestsReached.name, {
      ctr: this.MaxAuthenticationRequestsReached,
      isInternal: true
    });
  }

  static MaxAuthenticatedRequestsReached() {
    return this.unauthorized(this.MaxAuthenticatedRequestsReached.name, {
      ctr: this.MaxAuthenticatedRequestsReached,
      isInternal: true
    });
  }

  static CachedNotFound() {
    return this.notFound(this.CachedNotFound.name, {
      ctr: this.CachedNotFound
    });
  }

  /**
   * Overrides Boom static to create under Core instance
   * @param {String} fnName
   */
  static override(fnName) {
    const errorFn = super[this[fnName].name];

    CoreError[fnName] = function(message, options) {
      const error = errorFn(message);
      return new CoreError(error, {
        ctr: this[fnName],
        ...options
      });
    };
    Object.defineProperty(CoreError[fnName], 'name', {
      value: errorFn.name
    });
  }
}

CoreError.override('unauthorized');
CoreError.override('notFound');

module.exports = CoreError;
