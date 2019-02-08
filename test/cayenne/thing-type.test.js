const { expect } = require('code');

const Core = require('../../lib');
const Common = require('../common');

describe('[Cayenne - Thing Type Management]', () => {
  let response;
  const opts = Object.assign({}, Common.coreOpts);
  delete opts.options.streamingBaseUrl;

  let core = new Core(...Object.values(opts));

  let deviceTypeId;

  afterEach(() => core.cayenne.deleteDeviceType(deviceTypeId));

  it('Should be able to create a device type with channels', async () => {
    const payload = {
      name: 'Automated Device Type',
      description: 'Device type from automation',
      model: 'test',
      version: '1.0.0',
      properties: {},
      manufacturer: 'core-js',
      transport_protocol: 'jest',
      protocol_version: '17',
      category: 'sensor',
      codec: 'core-js',
      subcategory: 'test',
      parent_constraint: 'REQUIRED',
      child_constraint: 'NOT_ALLOWED'
    };

    response = await core.cayenne.createDeviceType(payload);
    expect(!!response).to.be.true();
    expect(response.id).to.be.string();
    deviceTypeId = response.id;

    const channel = {
      name: 'Automated Battery Channel',
      datatype: 'BATTERY',
      channel: '5'
    };
    response = await core.cayenne.addDeviceTypeChannel(deviceTypeId, channel);
    expect(!!response).to.be.true();
  });

  it('Should add device to registry and remove it', async () => {
    const payload = {
      name: 'Automated Device Type',
      description: 'Device type from automation',
      model: 'test',
      version: '1.0.0',
      properties: {},
      manufacturer: 'core-js',
      transport_protocol: 'jest',
      protocol_version: '17',
      category: 'sensor',
      codec: 'core-js',
      subcategory: 'test',
      parent_constraint: 'REQUIRED',
      child_constraint: 'NOT_ALLOWED'
    };

    response = await core.cayenne.createDeviceType(payload);
    expect(!!response).to.be.true();
    expect(response.id).to.be.string();
    deviceTypeId = response.id;

    const registryDevice = {
      hardware_id: `fff${Math.floor(Math.random() * 4503599627370495).toString(
        16
      )}`.toLowerCase(),
      codec: 'core-js',
      device_type_id: deviceTypeId
    };
    response = await core.cayenne.createRegistryDevice(registryDevice);
    expect(!!response).to.be.true();
    expect(response.id).to.be.string();
    response = await core.cayenne.deleteRegistryDevice(response.id);
    expect(!!response).to.be.true();
  });
});
