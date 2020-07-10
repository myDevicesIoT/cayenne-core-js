const classes = {
  Cayenne: require('./Services/cayenne'),
  DeloreanES: require('./Services/delorean-es'),
  Executor: require('./Services/executor'),
  Hermes: require('./Services/hermes'),
  Prometheus: require('./Services/prometheus'),
  Starbase: require('./Services/starbase'),
  Streaming: require('./Services/streaming'),
  Timekeeper: require('./Services/timekeeper')
};

/**
 * @typedef ServiceOpts
 *
 * @property {string} name
 * @property {string} url
 * @property {string} token
 */

class Core {
  /**
   * @param {Object}      coreOpts
   * @param {ServiceOpts} coreOpts.cayenne
   * @param {ServiceOpts} coreOpts.deloreanES
   * @param {ServiceOpts} coreOpts.executor
   * @param {ServiceOpts} coreOpts.hermes
   * @param {ServiceOpts} coreOpts.prometheus
   * @param {ServiceOpts} coreOpts.starbase
   * @param {ServiceOpts} coreOpts.streaming
   * @param {ServiceOpts} coreOpts.timekeeper
   * @param {Object}     [opts={}]
   */
  constructor(coreOpts, opts = {}) {
    Object.entries(coreOpts).forEach(([key, { name, url, token }]) => {
      if (!classes[name]) {
        return;
      }
      this[key] = new classes[name](url, token, opts);
    });
  }
}

module.exports = Core;
