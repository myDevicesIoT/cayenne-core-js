const { expect } = require('code');
const sinon = require('sinon');

const DeloreanES = require('../lib/Services/delorean-es');

/**
 * These assert the request paths only — no network. delorean-es serves
 * `/migrate/users` and `/replace/users` (delorean-es/bin/api/admin.js); posting
 * anything else 404s, and because the admin user-migration endpoints are only
 * ever driven by hand from a runbook, a wrong path here surfaces as a bare
 * "Not Found" long after the rest of a migration has already committed.
 */
describe('[Service][DeloreanES] admin user routes', () => {
  let service;
  let send;

  beforeEach(() => {
    service = new DeloreanES('http://delorean-es', 'token');
    send = sinon.stub(service, 'send').resolves({ updated: 0 });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('migrateUser posts to the route delorean-es serves', async () => {
    await service.migrateUser({
      from_application_id: 'source',
      to_application_id: 'target',
      users: ['3f2a0d6c-1f0a-4d0b-9a1e-0c5b2f7d8e90']
    });

    const [method, path] = send.firstCall.args;
    expect(method).to.equal('POST');
    expect(path).to.equal('/migrate/users');
  });

  it('migrateUser forwards the payload and keeps the long timeouts', async () => {
    const payload = {
      from_application_id: 'source',
      to_application_id: 'target',
      users: ['3f2a0d6c-1f0a-4d0b-9a1e-0c5b2f7d8e90']
    };

    await service.migrateUser(payload);

    const opts = send.firstCall.args[2];
    expect(opts.payload).to.equal(payload);
    expect(opts.response).to.equal(900000 * 3);
    expect(opts.deadline).to.equal(900000 * 3);
  });

  it('migrateUser lets callers override the timeouts', async () => {
    await service.migrateUser(
      { from_application_id: 'source', to_application_id: 'target', users: [] },
      { response: 1000, deadline: 2000 }
    );

    const opts = send.firstCall.args[2];
    expect(opts.response).to.equal(1000);
    expect(opts.deadline).to.equal(2000);
  });

  it('replaceUsers posts to the route delorean-es serves', async () => {
    await service.replaceUsers({
      app_id: 'target',
      to_user: '9c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
      users: ['3f2a0d6c-1f0a-4d0b-9a1e-0c5b2f7d8e90']
    });

    const [method, path] = send.firstCall.args;
    expect(method).to.equal('POST');
    expect(path).to.equal('/replace/users');
  });
});
