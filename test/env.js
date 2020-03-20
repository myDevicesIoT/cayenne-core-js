const dotenv = require('dotenv');
dotenv.load();

const {
  CAYENNE_BASE_URL,
  CAYENNE_TOKEN,

  DELOREAN_ES_BASE_URL,
  DELOREAN_ES_TOKEN,

  EXECUTOR_BASE_URL,
  EXECUTOR_TOKEN,

  HERMES_BASE_URL,
  HERMES_TOKEN,

  PROMETHEUS_BASE_URL,
  PROMETHEUS_TOKEN,

  STREAMING_BASE_URL,
  STREAMING_TOKEN,

  TIMEKEEPER_BASE_URL,
  TIMEKEEPER_TOKEN
} = process.env;

const options = {
  cayenneOpts: {
    name: 'Cayenne',
    url: CAYENNE_BASE_URL,
    token: CAYENNE_TOKEN
  },
  deloreanESOpts: {
    name: 'DeloreanES',
    url: DELOREAN_ES_BASE_URL,
    token: DELOREAN_ES_TOKEN
  },
  executorOpts: {
    name: 'Executor',
    url: EXECUTOR_BASE_URL,
    token: EXECUTOR_TOKEN
  },
  hermesOpts: {
    name: 'Hermes',
    url: HERMES_BASE_URL,
    token: HERMES_TOKEN
  },
  prometheusOpts: {
    name: 'Prometheus',
    url: PROMETHEUS_BASE_URL,
    token: PROMETHEUS_TOKEN
  },
  streamingOpts: {
    name: 'Streaming',
    url: STREAMING_BASE_URL,
    token: STREAMING_TOKEN
  },
  timekeeperOpts: {
    name: 'Timekeeper',
    url: TIMEKEEPER_BASE_URL,
    token: TIMEKEEPER_TOKEN
  }
};

module.exports = options;
