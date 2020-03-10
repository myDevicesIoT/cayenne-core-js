const boom = require('boom');
const nock = require('nock');
const { expect } = require('code');

const Request = require('../lib/Request');
const CoreError = require('../lib/CoreError');

describe('[Request]', () => {
  const baseUrl = 'https://mydevices.com';

  it('Should throw invalid credentials on unauthorized response', async () => {
    const path = 'unauthorized-first';
    nock(baseUrl)
      .get(`/${path}`)
      .reply(401, boom.unauthorized());

    const request = new Request('test', baseUrl, 'bad-token', {
      logger: console.log
    });

    await expect(request.send('GET', path)).to.reject(
      CoreError.InvalidCredentials().message
    );
  });

  it('Should throw invalid credentials immediately after previous request was unauthorized', async () => {
    const path = 'unauthorized-second';
    nock(baseUrl)
      .get(`/${path}`)
      .reply(401, boom.unauthorized());

    const request = new Request('test', baseUrl, 'bad-token', {
      logger: console.log
    });
    await request.send('GET', path).catch(() => {});

    nock(baseUrl)
      .get(`/${path}`)
      .reply(200, boom.unauthorized());
    await expect(request.send('GET', path)).to.reject(
      CoreError.InvalidCredentials().message
    );
  });

  it('Should timeout a request after response reaches threshold', async () => {
    const path = 'timeout';
    const request = new Request('test', baseUrl, 'bad-token', {
      logger: console.log
    });
    request.defaultResponse = 500;
    request.defaultDeadline = 1000;

    nock(baseUrl)
      .get(`/${path}`)
      .delayConnection(request.defaultResponse + 1)
      .reply(200, {});

    await expect(request.send('GET', path)).to.reject(
      new Error('Internal error').message
    );
  });

  it('Should timeout a request after body reached threshold', async () => {
    const path = 'timeout';
    const request = new Request('test', baseUrl, 'bad-token', {
      logger: console.log
    });
    request.defaultResponse = 500;
    request.defaultDeadline = 1000;

    nock(baseUrl)
      .get(`/${path}`)
      .delayBody(request.defaultDeadline + 1)
      .reply(200, {});

    await expect(request.send('GET', path)).to.reject(
      new Error('Internal error').message
    );
  });
});
