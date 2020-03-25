const { expect } = require('code');

const Core = require('../index');

const {
  cayenneOpts,
  deloreanESOpts,
  executorOpts,
  hermesOpts,
  prometheusOpts,
  // streamingOpts,
  timekeeperOpts
} = require('./env');

describe('[Service]', () => {
  it('Should be able to issue authenticated requests from Core', async () => {
    const serviceOpts = {
      cayenne: cayenneOpts,
      deloreanES: deloreanESOpts,
      executor: executorOpts,
      hermes: hermesOpts,
      prometheus: prometheusOpts,
      timekeeper: timekeeperOpts
    };
    const opts = { logger: console.log };
    const core = new Core.Core(serviceOpts, opts);
    await Promise.all(
      Object.entries(core).map(async ([name, clazz]) => {
        console.log(`service under test: ${name}`);
        await Promise.all(
          Object.getOwnPropertyNames(clazz.__proto__).map(async key => {
            if (!key.startsWith('get')) {
              return;
            }
            const { status } = await clazz[key]()
              .then(() => ({ status: 200 }))
              .catch(({ status }) => ({ status }));
            expect(status).to.not.equal(401);
            expect(status).to.not.equal(403);
          })
        );
      })
    );
  });

  it('Should be able to issue authenticated requests', async () => {
    await Promise.all(
      [
        cayenneOpts,
        deloreanESOpts,
        executorOpts,
        hermesOpts,
        prometheusOpts,
        timekeeperOpts
      ].map(async ({ name, url, token }) => {
        const clazz = new Core[name](url, token, { logger: console.log });

        await Promise.all(
          Object.getOwnPropertyNames(clazz.__proto__).map(async key => {
            if (!key.startsWith('get')) {
              return;
            }
            const { status } = await clazz[key]()
              .then(() => ({ status: 200 }))
              .catch(({ status }) => ({ status }));
            expect(status).to.not.equal(401);
            expect(status).to.not.equal(403);
          })
        );
      })
    );
  });
});
