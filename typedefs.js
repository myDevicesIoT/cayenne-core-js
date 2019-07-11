/////////////////////////////////
// Begin Interface definitions //
/////////////////////////////////

/** Interface for classes that cache responses */
class ICache {
  constructor() {}

  /**
   * Checks cache
   *
   * @param {String} key  Cache key to get
   * @param {Array}  rest Additional args required for provided cache
   *
   * @returns {Promise<{}>}
   */
  get(key, ...rest) {
    throw new Error(`Not implemented: ${key}, ${rest}`);
  }

  /**
   * Adds a cache value from Cayenne Core
   *
   * @param {String} key   Cache key to set
   * @param {{}}     value Cache value
   * @param {Array}  rest  Additional args required for provided cache
   *
   * @returns {Promise<Boolean>}
   */
  set(key, value, ...rest) {
    throw new Error(`Not implemented: ${key}, ${value}, ${rest}`);
  }

  /**
   * Drops the value at provided cache key
   *
   * @param {String} key  Cache key to drop
   * @param {Array}  rest Additional args required for provided caache function
   *
   * @returns {Promise<Boolean>}
   */
  drop(key, ...rest) {
    throw new Error(`Not implemented: ${key}, ${rest}`);
  }
}

module.exports = { ICache };
