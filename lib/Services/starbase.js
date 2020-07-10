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
    let mqttClient = new MQTT({
      username: clientId,
      password: clientSecret,
      clientId: hardwareId,
      broker: this.url
    });

    return new Promise((resolve, reject) => {
      try {
        mqttClient.connect(async (err, client) => {
          if (err) {
            client.end();
            return reject(err);
          }

          mqttClient.rawWrite('json', JSON.stringify(payload));
          await new Promise(resolve => setTimeout(resolve, 1000));
          client.end();
          mqttClient = null;
          return resolve();
        });

        mqttClient.client.on('error', () => {
          mqttClient.client.end();
          mqttClient = null;
          return resolve();
        });
        mqttClient.client.on('disconnect', () => {
          mqttClient.client.end();
          mqttClient = null;
          return resolve();
        });
      } catch (error) {
        if (!error.message.includes('path is already defined')) {
          mqttClient.client.end();
          mqttClient = null;
        }
      }
    });
  }
}

module.exports = Starbase;
