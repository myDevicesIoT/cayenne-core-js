const Auth = require('./Auth');
const Cayenne = require('./Services/cayenne');
const Delorean = require('./Services/delorean');
const Executor = require('./Services/executor');
const Hermes = require('./Services/hermes');
const Prometheus = require('./Services/prometheus');
const Streaming = require('./Services/streaming');
const Timekeeper = require('./Services/timekeeper');

/**
 * Cayenne Core Class
 */
class Core {
  /**
   * Constructs a new Cayenne Core API class
   *
   * @param {String} clientId  Client ID for application
   * @param {String} clientSecret  Client Secret for application
   * @param {String} authorizationUrl  Client Authorization URL
   * @param {Object} options  Additional options
   * @param {String} options.cayenneBaseUrl  Things URL
   * @param {String} options.deloreanBaseUrl  History URL
   * @param {String} options.executorBaseUrl  Jobs URL
   * @param {String} options.hermesBaseUrl  Notifications URL
   * @param {String} options.prometheusBaseUrl  Lora URL
   * @param {String} options.streamingBaseUrl  Streaming URL
   * @param {String} options.timekeeperBaseUrl  Jobs URL
   * @param {Function | Object | Boolean} [options.logger=false]  Optional logger
   * @param {Boolean} [options.isOffline=true] Whether to request offline access
   */
  constructor(clientId, clientSecret, authorizationUrl, options) {
    options = Object.assign({ logger: false, isOffline: true }, options);

    this.auth = new Auth(clientId, clientSecret, authorizationUrl, options);

    this.cayenne = new Cayenne(options.cayenneBaseUrl, this.auth);
    this.delorean = new Delorean(options.deloreanBaseUrl, this.auth);
    this.executor = new Executor(options.executorBaseUrl, this.auth);
    this.hermes = new Hermes(options.hermesBaseUrl, this.auth);
    this.prometheus = new Prometheus(options.prometheusBaseUrl, this.auth);
    this.timekeeper = new Timekeeper(options.timekeeperBaseUrl, this.auth);

    if (!!options.streamingBaseUrl) {
      this.streaming = new Streaming(options.streamingBaseUrl, this.auth);
    }
  }

  /**
   * @function
   * @public
   *
   * Initializes the streaming connection
   *
   * @returns {Promise}
   */
  connectStreaming() {
    if (this.streaming) {
      return this.streaming.connect();
    } else {
      this.auth.log('streaming is not enabled', 'warn');
    }
    return Promise.resolve();
  }
}

module.exports = Core;
