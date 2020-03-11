const Request = require('./../Request');

class Cayenne extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {object} [options]
   */
  constructor(url, token, options = {}) {
    super(Cayenne.name, url, token, options);
  }

  /**
   * Creates the Cayenne client necessary to create things for account
   * @param {String}  userId
   */
  createClient(userId) {
    const path = `/clients`;
    const payload = { user_id: userId };

    return this.send('POST', path, { payload });
  }

  /**
   * Get the client for streaming subscribing
   * @param {String}  userId
   */
  getClient(userId) {
    const path = `/clients`;
    const query = { user_id: userId };

    return this.send('GET', path, { query });
  }

  /*
   * Begin Thing Routes
   */

  /**
   * @param {String}  userId
   */
  getThings(userId) {
    const path = `/things`;
    const query = { user_id: userId };

    return this.send('GET', path, { query });
  }

  /**
   * Get a sensor by id
   * @param {String}  userId
   * @param {String}  thingId Thing UUI
   */
  getThing(userId, thingId) {
    const path = `/things/${thingId}`;
    const query = { user_id: userId };

    return this.send('GET', path, { query });
  }

  /**
   * Creates a thing
   * @param {String}  userId
   * @param {Object}  payload                    Thing to add
   * @param {String}  payload.name               Thing's name
   * @param {String}  payload.devicee_type_id    Thing's unqiue device type id
   * @param {String}  payload.parent_id          Thing's parent id
   * @param {Object}  payload.properties         Thing's properties
   * @param {String}  payload.properties.channel Thing's channel
   * @param {Number}  payload.active             If thing is active or not. 1 = active
   * @param {String}  payload.status             ACTIVATED or DEACTIVATED
   */
  createThing(userId, payload) {
    const path = `/things`;
    payload.user_id = userId;

    return this.send('POST', path, { payload });
  }

  /**
   * @param {String}  userId
   * @param {String}  thingId
   * @param {Object}  payload
   * @param {Object}  [payload.properties]
   */
  updateThing(userId, thingId, payload) {
    const path = `/things/${thingId}`;
    const query = { user_id: userId };

    return this.send('PUT', path, { payload, query });
  }

  /**
   * @param {String}  userId
   * @param {String}  thingId
   */
  deleteThing(userId, thingId) {
    const path = `/things/${thingId}`;
    const query = { user_id: userId };

    return this.send('DELETE', path, { query });
  }

  /**
   * @param {String}  userId
   */
  destroyUser(userId) {
    const path = `/things`;
    const query = { user_id: userId };

    return this.send('DELETE', path, { query });
  }

  /**
   * Begin command
   * @param {String} deviceTypeId
   * @param {String} command
   * @param {Object} command
   */
  emitCommand(deviceId, payload) {
    const path = `/things/${deviceId}/cmd`;
    return this.send('POST', path, { payload });
  }

  /*
   * End Thing Routes
   */

  /*
   * Begin Device Attribute Routes
   */

  /*
   * Begin Device Attribute Routes
   */

  /**
   * Gets all attribute groups and attributes for a device
   * @param {String} deviceId The device id to get attributes for
   * @param {String} userId The user id of the user that owns the parent device
   * @param {Object} query
   */
  getAttributeGroups(deviceId, userId, query) {
    const path = `/things/${deviceId}/groups`;
    query = { ...query, user_id: userId };
    return this.send('GET', path, { query });
  }

  /**
   * Update an attribute group. Pass null to group_id to create a new group.
   * @param {String} deviceId The id of the parent device
   * @param {String?} groupId Optional: Updates group, if null creates instead
   * @param {Object} payload The group to update
   * @param {UUID?} payload.id Optional: The group id, will be overriden by group_id parameter
   * @param {String} payload.name The name of the group
   * @param {Integer} payload.order The display order of the group
   * @param {String?} payload.device_id Optional: The device id this group is attached to. Overriden by deviceId paramter
   * @param {UUID} payload.user_id The user id of the device owner
   * @param {UUID} payload.client_id The application id of the API call
   */
  updateGroup(deviceId, groupId, payload) {
    const path = `/things/${deviceId}/groups/${groupId}`;

    return this.send('PUT', path, { payload });
  }

  /**
   * Create an attribute group. Pass null to group_id to create a new group.
   * @param {String} deviceId The id of the parent device
   * @param {Object} payload The group to create
   * @param {UUID?} payload.id Optional: The group id, will be overriden by group_id parameter
   * @param {String} payload.name The name of the group
   * @param {Integer} payload.order The display order of the group
   */
  createGroup(deviceId, payload) {
    const path = `/things/${deviceId}/groups`;

    return this.send('POST', path, { payload });
  }

  /**
   * Delete a group
   * @param {String} deviceId
   * @param {String} groupId
   */
  deleteGroup(deviceId, groupId) {
    const path = `/things/${deviceId}/groups/${groupId}`;
    return this.send('DELETE', path);
  }

  /**
   * Create or Update an attribute. Pass null to attribute_id to create a new attribute.
   * @param {String} deviceId The id of the parent device
   * @param {String} groupId The id of the parent group
   * @param {Object} payload The attribute to create or update
   * @param {UUID?} payload.id Optional: The attribute id, will be overriden by attributeId parameter
   * @param {String} payload.name The name of the attribute
   * @param {Integer} payload.order The display order of the attribute
   * @param {String?} payload.device_id Optional: The device id this attribute is attached to. Overriden by deviceId paramter
   * @param {UUID} payload.user_id The user id of the device owner
   * @param {UUID?} payload.group_id The group id of the parent group
   * @param {String} payload.value The value, contents vary based on value_type
   * @param {String} payload.value_type The type of content contained in value string
   */
  createAttribute(deviceId, groupId, payload) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes`;

    return this.send('POST', path, { payload });
  }

  /**
   * Update an attribute. Pass null to attribute_id to create a new attribute.
   * @param {String} deviceId The id of the parent device
   * @param {String} groupId The id of the parent group
   * @param {String?} attributeId Updates attribute
   * @param {Object} payload The attribute to update
   * @param {UUID?} payload.id Optional: The attribute id, will be overriden by attributeId parameter
   * @param {String} payload.name The name of the attribute
   * @param {Integer} payload.order The display order of the attribute
   * @param {String?} payload.device_id Optional: The device id this attribute is attached to. Overriden by deviceId paramter
   * @param {UUID} payload.user_id The user id of the device owner
   * @param {UUID?} payload.group_id The group id of the parent group
   * @param {String} payload.value The value, contents vary based on value_type
   * @param {String} payload.value_type The type of content contained in value string
   */
  updateAttribute(deviceId, groupId, attributeId, payload) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;

    return this.send('PUT', path, { payload });
  }

  /**
   * Delete an attribute
   * @param {String} deviceId
   * @param {String} groupId
   * @param {String} attributeId
   */
  deleteAttribute(deviceId, groupId, attributeId) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;
    return this.send('DELETE', path);
  }

  /**
   * Get an attribute
   * @param {String} deviceId
   * @param {String} groupId
   * @param {String} attributeId
   */
  getAttribute(deviceId, groupId, attributeId) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;
    return this.send('GET', path);
  }

  /*
   * End Device Attribute Routes
   */

  /*
   * Begin Registry Routes
   */

  /**
   * Pairs a thing to account
   * @param {Object}  payload
   * @param {String}  payload.name         Thing's name
   * @param {String}  payload.hardware_id  Thing's unique hardware id
   * @param {String}  payload.network      Thing's network
   * @param {String}  payload.user_id      User's id of where to pair account
   */
  pairThing(userId, payload) {
    const path = `/things/pair`;
    payload.user_id = userId;

    return this.send('POST', path, { payload });
  }

  /**
   * Pairs a thing to account
   * @param {Object}  userId
   * @param {Object}  thingId
   * @param {String}  payload.name         Thing's name
   * @param {String}  payload.hardware_id  Thing's unique hardware id
   * @param {String}  payload.network      Thing's network
   */
  pairUpdateThing(userId, thingId, payload) {
    const path = `/things/${thingId}/pair`;
    payload.user_id = userId;

    return this.send('PUT', path, { payload });
  }

  /**
   * Gets a device properties by hardware id
   * @param {String} hardwareId Device's unique hardware id
   */
  getRegistryDevice(hardwareId) {
    const path = `/things/registry/eui/${hardwareId}`;
    return this.send('GET', path);
  }

  /**
   * @param {Object}  payload
   * @param {String}  payload.hardware_id
   * @param {String}  payload.codec
   * @param {String}  payload.devicee_type_id
   */
  createRegistryDevice(payload) {
    const path = `/things/registry`;
    return this.send('POST', path, { payload });
  }

  /**
   * @param {String}  registryId
   */
  deleteRegistryDevice(registryId) {
    const path = `/things/registry/${registryId}`;
    return this.send('DELETE', path);
  }

  /*
   * End Registry Routes
   */

  /*
   * Begin Types + Datatypes Routes
   */

  /**
   * Gets all thing data types
   */
  getThingDataTypes() {
    const path = `/things/datatypes`;
    return this.send('GET', path);
  }

  /**
   * Gets V2 all things data types
   * @param {Object} query
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   */
  getThingDataTypesV2(query) {
    const path = `/v2/things/datatypes`;
    return this.send('GET', path, { query });
  }

  /**
   * Get V2 one things data type
   */
  getThingDataTypeV2(id) {
    const path = `/v2/things/datatypes/${id}`;
    return this.send('GET', path);
  }

  /**
   * Get V2 one things data type
   */
  deleteThingDataTypeV2(id) {
    const url = `/v2/things/datatypes/${id}`;
    return this.auth.send('DELETE', url);
  }

  /**
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.label
   * @param {String}  payload.payload
   */
  createThingDataTypeV2(payload) {
    const url = `/v2/things/datatypes`;
    return this.auth.send('POST', url, { payload });
  }

  /**
   * @param {Object}  id
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.label
   * @param {String}  payload.payload
   */
  updateThingDataTypeV2(id, payload) {
    const url = `/v2/things/datatypes/${id}`;
    return this.auth.send('PUT', url, { payload });
  }

  /**
   * Get V2 one things data type properties
   * @param {String} id
   * @param {Object} query
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   */
  getThingDataTypePropertiesV2(id, query) {
    const path = `/v2/things/datatypes/${id}/properties`;
    return this.send('GET', path, { query });
  }

  /**
   * Count V2 all things data types
   * @param {string} id
   * @param {Object} query
   */
  countThingDataTypePropertiesV2(id, query) {
    const url = `/v2/things/datatypes/${id}/properties`;
    return this.auth.send('GET', url, { query });
  }

  /**
   * Create a V2 datatype property
   * @param {String} typeId
   * @param {Object} payload
   */
  createThingDataTypePropertyV2(typeId, payload) {
    const url = `/v2/things/datatypes/${typeId}/properties`;
    return this.auth.send('POST', url, { payload });
  }

  /**
   * Update V2 datatypes properties
   * @param {String} typeId
   * @param {Number} propertyId
   * @param {Object} payload
   */
  updateThingDataTypePropertyV2(typeId, pid, payload) {
    const url = `/v2/things/datatypes/${typeId}/properties/${pid}`;
    return this.auth.send('PUT', url, { payload });
  }

  /**
   * delete V2 one things data type properties
   * @param {String} typeId
   * @param {Number} pid
   */
  deleteThingDataTypePropertyV2(typeId, pid) {
    const url = `/v2/things/datatypes/${typeId}/properties/${pid}`;
    return this.auth.send('GET', url);
  }

  /**
   * Get V2 one things data type property by it's id
   * @param {String} typeId
   * @param {Number} pid
   */
  getThingDataTypePropertyV2(id, pid) {
    const path = `/v2/things/datatypes/${id}/properties/${pid}`;
    return this.send('GET', path);
  }

  /**
   * Gets thing types by query
   * @param {Object} query
   */
  getThingTypes(query) {
    const path = `/things/types`;
    return this.send('GET', path, { query });
  }

  /**
   * Gets all thing types
   */
  getAllThingTypes() {
    const path = `/things/types/all`;
    return this.send('GET', path);
  }

  /**
   * Get a device type
   * @param {String} deviceTypeId
   */
  getDeviceType(deviceTypeId) {
    const path = `/things/types/${deviceTypeId}`;
    return this.send('GET', path);
  }

  /**
   * Count device types
   */
  countDeviceTypes() {
    const url = `/things/types/count`;
    return this.auth.send('GET', url);
  }

  /**
   * Gets a device's meta data by device type id
   * @param {String}  deviceTypeId
   * @param {Objet}   [opts={}]                    Additional options
   * @param {Boolean} [opts.useCache=false]        If cached result should be retrieved
   * @param {Boolean} [opts.cacheOnNotFound=false] Whether to cache if a 404 error is returned
   */
  getDeviceTypeMeta(deviceTypeId, opts) {
    opts = { useCache: false, cacheOnNotFound: false, ...opts };

    const path = `/things/types/${deviceTypeId}/meta`;
    return this.send('GET', path, {
      cache: opts.useCache
        ? {
            key: this.auth.genCacheKey(
              this.getDeviceTypeMeta.name,
              ...arguments
            ),
            action: this.auth.cache.actions.get,
            onNotFound: opts.cacheOnNotFound
          }
        : false
    });
  }

  /**
   * Count a device's meta data by device type id
   * @param {String}  deviceTypeId
   */
  countDeviceTypeMeta(deviceTypeId) {
    const url = `/things/types/${deviceTypeId}/meta/count`;
    return this.auth.send('GET', url);
  }

  /**
   * Gets a device's meta data by device type id
   * @param {String}  deviceTypeId
   * @param {String}  key
   * @param {Objet}   [opts={}]                    Additional options
   * @param {Boolean} [opts.useCache=false]        If cached result should be retrieved
   * @param {Boolean} [opts.cacheOnNotFound=false] Whether to cache if a 404 error is returned
   */
  getDeviceTypeMetaByKey(deviceTypeId, key, opts = {}) {
    opts = { useCache: false, cacheOnNotFound: false, ...opts };

    const path = `/things/types/${deviceTypeId}/meta/${key}`;

    return this.send('GET', path, {
      cache: opts.useCache
        ? {
            key: this.auth.genCacheKey(
              this.getDeviceTypeMetaByKey.name,
              ...arguments
            ),
            action: this.auth.cache.actions.get,
            onNotFound: opts.cacheOnNotFound
          }
        : false
    });
  }

  /**
   * Gets a device's channel meta by device type id
   * @param {String}  deviceTypeId
   */
  getDeviceTypeChannels(deviceTypeId) {
    const path = `/things/types/${deviceTypeId}/channels`;
    return this.send('GET', path);
  }

  /**
   * Count a device's channel meta by device type id
   * @param {String}  deviceTypeId
   */
  countDeviceTypeChannels(deviceTypeId) {
    const url = `/things/types/${deviceTypeId}/channels/count`;
    return this.auth.send('GET', url);
  }

  /**
   * Get a device type's uses
   * @param {String}  deviceTypeId
   */
  getDeviceTypeUses(deviceTypeId) {
    const path = `/things/types/${deviceTypeId}/uses`;
    return this.send('GET', path);
  }

  /**
   * Count a device type's uses
   * @param {String}  deviceTypeId
   */
  countDeviceTypeUses(deviceTypeId) {
    const url = `/things/types/${deviceTypeId}/uses/count`;
    return this.auth.send('GET', url);
  }

  /**
   * Creates a new device type
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.description
   * @param {String}  payload.model
   * @param {String}  payload.version
   * @param {String}  payload.properties
   * @param {String}  payload.manufacturer
   * @param {String}  payload.transport_protocol
   * @param {String}  payload.protocol_version
   * @param {String}  payload.category
   * @param {String}  payload.codec
   * @param {String}  payload.subcategory
   * @param {String}  payload.parent_constraint
   * @param {String}  payload.child_constraint
   */
  createDeviceType(payload) {
    const path = `/things/types`;
    return this.send('POST', path, { payload });
  }

  /**
   * Updates a device type
   * @param {String}  id
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.description
   * @param {String}  payload.model
   * @param {String}  payload.version
   * @param {String}  payload.properties
   * @param {String}  payload.manufacturer
   * @param {String}  payload.transport_protocol
   * @param {String}  payload.protocol_version
   * @param {String}  payload.category
   * @param {String}  payload.codec
   * @param {String}  payload.subcategory
   * @param {String}  payload.parent_constraint
   * @param {String}  payload.child_constraint
   */
  updateDeviceType(deviceTypeId, payload) {
    const url = `/things/types/${deviceTypeId}`;
    return this.auth.send('PUT', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.datatype
   * @param {String}  payload.channel
   * @param {String}  [payload.ipso]
   */
  addDeviceTypeChannel(deviceTypeId, payload) {
    const path = `/things/types/${deviceTypeId}/channels`;
    return this.send('POST', path, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.datatype
   * @param {String}  payload.channel
   * @param {String}  [payload.ipso]
   */
  updateDeviceTypeChannel(deviceTypeId, channelId, payload) {
    const url = `/things/types/${deviceTypeId}/channels/${channelId}`;
    return this.auth.send('PUT', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  channelId
   */
  deleteDeviceTypeChannel(deviceTypeId, channelId) {
    const url = `/things/types/${deviceTypeId}/channels/${channelId}`;
    return this.auth.send('DELETE', url);
  }

  /**
   * @param {String}  deviceTypeId
   * @param {Object}  payload
   * @param {String}  payload.key
   * @param {String}  payload.value
   */
  addDeviceTypeMeta(deviceTypeId, payload) {
    const path = `/things/types/${deviceTypeId}/meta`;
    return this.send('POST', path, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  metaId
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.datatype
   * @param {String}  payload.channel
   * @param {String}  [payload.ipso]
   */
  updateDeviceTypeMeta(deviceTypeId, metaId, payload) {
    const url = `/things/types/${deviceTypeId}/meta/${metaId}`;
    return this.auth.send('PUT', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  metaId
   */
  deleteDeviceTypeMeta(deviceTypeId, metaId) {
    const url = `/things/types/${deviceTypeId}/channels/${metaId}`;
    return this.auth.send('DELETE', url);
  }

  /**
   * @param {String}  deviceTypeId
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {Boolean} [payload.default]
   * @param {Number}  [payload.alert_min]
   * @param {Number}  [payload.alert_max]
   * @param {Number}  [payload.alert_readings]
   */
  addDeviceTypeUse(deviceTypeId, payload) {
    const path = `/things/types/${deviceTypeId}/uses`;
    return this.send('POST', path, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  useId
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.datatype
   * @param {String}  payload.channel
   * @param {String}  [payload.ipso]
   */
  updateDeviceTypeUse(deviceTypeId, useId, payload) {
    const url = `/things/types/${deviceTypeId}/meta/${useId}`;
    return this.auth.send('PUT', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  useId
   */
  deleteDeviceTypeUse(deviceTypeId, useId) {
    const url = `/things/types/${deviceTypeId}/channels/${useId}`;
    return this.auth.send('DELETE', url);
  }

  /**
   * Delete a device type
   * @param {String} deviceTypeId
   */
  deleteDeviceType(deviceTypeId) {
    const path = `/things/types/${deviceTypeId}`;
    return this.send('DELETE', path);
  }

  /*
   * End Types + Datatypes Routes
   */

  /**
   * * Begin Integrations and Fuses
   */

  /**
   * Gets all integrations
   * @param {Object} query
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   * @param {Number} [query.active]
   */
  getIntegrations(query) {
    const path = `/integrations`;
    return this.send('GET', path, { query });
  }

  /**
   * Gets an integration by id
   * @param {String} integrationId
   */
  getIntegration(integrationId) {
    const path = `/integrations/${integrationId}`;
    return this.send('GET', path);
  }

  /**
   * Get all fuses
   * @param {String} userId
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   */
  getFuses(userId, query) {
    const path = `/fuses`;
    query = { ...query, user_id: userId };

    return this.send('GET', path, { query });
  }

  /**
   * Gets an fuses by id
   * @param {String} userId
   * @param {String} fuseId
   */
  getFuse(userId, fuseId) {
    const path = `/fuses/${fuseId}`;
    const query = { user_id: userId };

    return this.send('GET', path, { query });
  }

  /**
   * Creates a fuse
   * @param {String} userId
   * @param {Object} payload
   * @param {String} payload.name
   * @param {String} payload.integration_id
   * @param {Object[]} payload.gettings
   */
  createFuse(userId, payload) {
    const path = `/fuses`;
    payload.account_id = userId;

    return this.send('POST', path, { payload });
  }

  /**
   * Updates a fuse
   * @param {String} userId
   * @param {String} fuseId
   * @param {Object} payload
   * @param {String} payload.name
   * @param {Object[]} payload.settings
   */
  updateFuse(userId, fuseId, payload) {
    const path = `/fuses/${fuseId}`;
    const query = { user_id: userId };

    return this.send('PUT', path, { payload, query });
  }

  /**
   * Disables fuses
   */
  disableFuses() {
    const path = `/fuses/disable`;

    return this.send('PUT', path, {});
  }

  /**
   * Deletes a fuse
   * @param {String} userId
   * @param {String} fuseId
   */
  deleteFuse(userId, fuseId) {
    const path = `/fuses/${fuseId}`;
    const query = { user_id: userId };

    return this.send('DELETE', path, { query });
  }
  /**
   * @public
   * @param {String} userId Owner of the fuse
   * @param {String} fuseId Fuse to execute
   * @param {{}}     payload Payload to send to fuse execution
   */
  executeFuse(userId, fuseId, payload) {
    const path = `/fuses/${fuseId}/execute`;
    payload.user_id = userId;

    return this.send('POST', path, { payload });
  }

  /**
   * * End Integrations and Fuses
   */

  /**
   * * Begin Application
   */

  getApplication(applicationId) {
    const path = `/applications/${applicationId}`;

    return this.send('GET', path);
  }

  /**
   *
   * @param {String} domain
   * @param {Object} query
   * @param {Number} [query.page = 0]
   * @param {Number} [query.limit = 25]
   */
  getPublicApplicationSettingsByDomain(domain, query) {
    const path = `/applications/domains/${domain}/settings`;

    return this.send('GET', path, { isPublic: true, query });
  }

  /**
   *
   * @param {String} applicationId
   * @param {Object} query
   * @param {Number} [query.page = 0]
   * @param {Number} [query.limit = 25]
   */
  getPublicApplicationSettings(applicationId, query) {
    const path = `/applications/${applicationId}/settings`;

    return this.send('GET', path, { isPublic: true, query });
  }

  /**
   * @param {String} applicationId
   * @param {String} name
   */
  getPublicApplicationSetting(applicationId, name) {
    const path = `/applications/${applicationId}/settings/${name}`;

    return this.send('GET', path, { isPublic: true });
  }

  /**
   * @param {String} applicationId
   * @param {Object} query
   * @param {Number} [query.page=0]
   * @param {Number} [query.limit=25]
   */
  getApplicationSettings(applicationId, query) {
    query = { page: 0, limit: 25, ...query };
    const path = `/applications/${applicationId}/settings`;

    return this.send('GET', path, { query });
  }

  /**
   * @param {String} applicationId
   * @param {String} name
   */
  getApplicationSetting(applicationId, name) {
    const path = `/applications/${applicationId}/settings/${name}`;

    return this.send('GET', path);
  }

  /**
   * * End Applications
   */
}

module.exports = Cayenne;
