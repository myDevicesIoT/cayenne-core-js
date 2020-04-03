const { MQTT } = require('cayennejs');

class Starbase {
  /**
   * @param {string} url
   */
  constructor(url) {
    this.url = url;
  }

  /**
   * Publishes JSON data to Starbase.
   *
   * @param {string}   clientId
   * @param {string}   clientSecret
   * @param {string}   hardwareId
   * @param {Object[]} payload
   * @param {number}   payload[].channel
   * @param {number}   payload[].value
   * @param {string}   payload[].type
   * @param {string}   payload[].unit
   */
  publishJSON(clientId, clientSecret, hardwareId, payload) {
    const mqttClient = new MQTT({
      username: clientId,
      password: clientSecret,
      clientId: hardwareId,
      broker: this.url
    });

    return new Promise((resolve, reject) => {
      try {
        mqttClient.connect(async (err, client) => {
          if (err) {
            return reject(err);
          }

          mqttClient.rawWrite('json', JSON.stringify(payload));
          await new Promise(resolve => setTimeout(resolve, 1000));
          client.end();
          return resolve();
        });
      } catch (error) {
        return resolve();
      }
    });
  }
}

module.exports = Starbase;