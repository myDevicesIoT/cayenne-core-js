const socket = require('socket.io-client');

const Request = require('./../Request');

class Streaming extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {object} [options]
   */
  constructor(url, token, options = {}) {
    super(Streaming.name, url, token, options);

    /**
     * Events
     */
    this.eventUserUnsubscribe = 'service-unsubscribe';
    this.eventUserSubscribe = 'service-subscribe';

    this.socket = null;
  }

  async connect() {
    this.socket = socket(this.url, {
      reconnection: true,
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000,
      extraHeaders: { token: this.token },
      path: '/stream',
      transports: ['websocket']
    });

    this.socket.on('connect', this.onConnect.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('event', this.onEvent.bind(this));
    this.socket.on('connect_error', this.onConnectError.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('reconnect', this.onReconnect.bind(this));
    this.socket.on('pmessage', this.onMessage.bind(this));
  }

  /**
   * Event handlers
   */

  onConnect() {
    this.log(`connected to ${this.url}`, 'info');
  }

  onDisconnect() {
    this.log(`disconnected from ${this.url}`, 'warn');
  }

  onEvent(data) {
    this.log(data, 'debug');
  }

  onConnectError(err) {
    this.log(`connection error: ${err}`, 'error');
  }

  onError(err) {
    this.log(`error: ${err}`, 'error');
  }

  onReconnect() {
    this.log('reonnection received', 'info');
  }

  onMessage(msg) {
    this.log(
      `message received, app: ${msg.applicationId}, eventType: ${msg.eventType}, user: ${msg.userId}`,
      'debug'
    );
    return this.onMessageHandler(msg.eventType, msg);
  }

  /**
   * Set the function to fire when a cayenne message is received
   * @param {Function} fn
   */
  setMessageHandler(fn) {
    this.onMessageHandler = fn;
  }

  onMessageHandler() {
    this.log('noop', 'debug');
  }

  /**
   * Emitters
   */

  emitUnsubscribe(msg) {
    this.log(
      `closing a connection for user(s): ${msg.map(m => m.user_id)}`,
      'verbose'
    );
    return this.socket.emit(this.eventUserUnsubscribe, msg);
  }

  emitSubscribe(msg) {
    this.log(
      `opening a connections for user(s): ${msg.map(m => m.user_id)}`,
      'verbose'
    );
    return this.socket.emit(this.eventUserSubscribe, msg);
  }
}

module.exports = Streaming;
