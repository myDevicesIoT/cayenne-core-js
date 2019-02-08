require('dotenv').config();

let {
  AUTH,
  CAYENNE,
  DELOREAN,
  EXECUTOR,
  HERMES,
  PROMETHEUS,
  STREAMING,
  TIMEKEEPER,

  CLIENT_ID,
  CLIENT_SECRET
} = process.env;

EXECUTOR = `${EXECUTOR}/v1.0`;
HERMES = `${HERMES}/v1.1`;
TIMEKEEPER = `${TIMEKEEPER}/v1.1`;

const opts = {
  coreOpts: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    authorizationUrl: `${AUTH}/auth/realms/cayenne-core/protocol/openid-connect/token`,
    options: {
      logger: console.log,
      cayenneBaseUrl: CAYENNE,
      deloreanBaseUrl: DELOREAN,
      executorBaseUrl: EXECUTOR,
      hermesBaseUrl: HERMES,
      prometheusBaseUrl: PROMETHEUS,
      streamingBaseUrl: STREAMING,
      timekeeperBaseUrl: TIMEKEEPER
    }
  }
};

module.exports = opts;
