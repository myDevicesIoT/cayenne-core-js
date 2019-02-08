const { expect } = require('code');
const sinon = require('sinon');

const Core = require('../lib');
const CoreError = require('./../lib/CoreError');

const Common = require('./common');

describe('CoreError', () => {
  it('Should throw invalid credentials when not provided', () => {
    const opts = Object.assign({}, Common.coreOpts);
    opts.clientId = null;
    opts.clientSecret = null;

    expect(() => new Core(...Object.values(opts))).throws(
      CoreError.InvalidApplicationCredentials.name
    );

    return;
  });

  it('Should throw invalid credentials on incorrect creds', async () => {
    const opts = Object.assign({}, Common.coreOpts);
    opts.clientId = 'invalid-id';
    opts.clientSecret = 'invalid-secret';

    const core = new Core(...Object.values(opts));

    expect(core.cayenne.getDeviceType('some-id')).rejects(
      CoreError.InvalidApplicationCredentials.name
    );

    return;
  });
});
