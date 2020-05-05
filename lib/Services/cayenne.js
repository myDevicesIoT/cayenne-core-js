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
   * @param {string} applicationId
   * @param {string} userId
   */
  createClient(applicationId, userId) {
    const path = `/clients`;
    const payload = this.setTenant(applicationId, userId);

    return this.send('POST', path, { payload });
  }

  /**
   * Get the client for streaming subscribing
   * @param {string} applicationId
   * @param {string} userId
   */
  getClient(applicationId, userId) {
    const path = `/clients`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /*
   * Begin Thing Routes
   */

  /**
   * @param {string} applicationId
   * @param {string} userId
   */
  getThings(applicationId, userId) {
    const path = `/things`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /**
   * Get a sensor by id
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} thingId Thing UUI
   */
  getThing(applicationId, userId, thingId) {
    const path = `/things/${thingId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /**
   * Creates a thing
   * @param {string} userId
   * @param {Object} payload                    Thing to add
   * @param {string} payload.name               Thing's name
   * @param {string} payload.device_type_id     Thing's unique device type id
   * @param {string} payload.parent_id          Thing's parent id
   * @param {Object} payload.properties         Thing's properties
   * @param {string} payload.properties.channel Thing's channel
   * @param {Number} payload.active             If thing is active or not. 1 = active
   * @param {string} payload.status             ACTIVATED or DEACTIVATED
   */
  createThing(applicationId, userId, payload) {
    const path = `/things`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * @param {string} userId
   * @param {string} thingId
   * @param {Object} payload
   * @param {Object} [payload.properties]
   */
  updateThing(applicationId, userId, thingId, payload) {
    const path = `/things/${thingId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('PUT', path, { payload, query });
  }

  /**
   * @param {string} userId
   * @param {string} thingId
   */
  deleteThing(applicationId, userId, thingId) {
    const path = `/things/${thingId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   */
  deleteThings(applicationId, userId) {
    const url = `/things`;
    const query = this.setTenant(applicationId, userId);

    return this.auth.send(this.service, 'DELETE', url, { query });
  }

  /**
   * @param {String}  userId
   */
  destroyUser(applicationId, userId) {
    const path = `/things`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * Emits a command.
   * @param {string} deviceId
   * @param {Object} payload
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
   * @param {string} applicationId
   * @param {string} userId        The user id of the user that owns the parent device
   * @param {string} deviceId      The device id to get attributes for
   * @param {Object} query
   */
  getAttributeGroups(applicationId, userId, deviceId, query) {
    const path = `/things/${deviceId}/groups`;
    query = this.setTenant(applicationId, userId);
    return this.send('GET', path, { query });
  }

  /**
   * Destroys all groups and attributes for a user
  * @param {string} applicationId
   * @param {string} userId The user id of the user that owns the parent device
   */
  destroyGroups(applicationId, userId) {
    const url = `/things/groups`;
    const query = this.setTenant(applicationId, userId);
    return this.auth.send(this.service, 'DELETE', url, { query });
  }

  /**
   * Update an attribute group. Pass null to group_id to create a new group.
   * @param {string}  applicationId
   * @param {string}  userId
   * @param {string}  deviceId            The id of the parent device
   * @param {string}  [groupId]           Optional: Updates group, if null creates instead
   * @param {Object}  payload             The group to update
   * @param {string}  [payload.id]        Optional: The group id, will be overriden by group_id parameter
   * @param {string}  payload.name        The name of the group
   * @param {number}  payload.order       The display order of the group
   * @param {string}  [payload.device_id] Optional: The device id this group is attached to. Overriden by deviceId paramter
   */
  updateGroup(applicationId, userId, deviceId, groupId, payload) {
    const path = `/things/${deviceId}/groups/${groupId}`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('PUT', path, { payload });
  }

  /**
   * Create an attribute group. Pass null to group_id to create a new group.
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId      The id of the parent device
   * @param {Object} payload       The group to create
   * @param {string} [payload.id]  Optional: The group id, will be overriden by group_id parameter
   * @param {string} payload.name  The name of the group
   * @param {number} payload.order The display order of the group
   */
  createGroup(applicationId, userId, deviceId, payload) {
    const path = `/things/${deviceId}/groups`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * Delete a group
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {string} groupId
   */
  deleteGroup(applicationId, userId, deviceId, groupId) {
    const path = `/things/${deviceId}/groups/${groupId}`;
    const query = this.setTenant(applicationId, userId);
    return this.send('DELETE', path, { query });
  }

  /**
   * Create or Update an attribute. Pass null to attribute_id to create a new attribute.
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId            The id of the parent device
   * @param {string} groupId             The id of the parent group
   * @param {Object} payload             The attribute to create or update
   * @param {string} payload.id          Optional: The attribute id, will be overriden by attributeId parameter
   * @param {string} payload.name        The name of the attribute
   * @param {number} payload.order       The display order of the attribute
   * @param {string} [payload.device_id] Optional: The device id this attribute is attached to. Overriden by deviceId paramter
   * @param {string} payload.user_id     The user id of the device owner
   * @param {string} payload.group_id    The group id of the parent group
   * @param {string} payload.value       The value, contents vary based on value_type
   * @param {string} payload.value_type  The type of content contained in value string
   */
  createAttribute(applicationId, userId, deviceId, groupId, payload) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * Update an attribute. Pass null to attribute_id to create a new attribute.
   * @param {string} applicationId
   * @param {strin}  userId
   * @param {string} deviceId            The id of the parent device
   * @param {string} groupId             The id of the parent group
   * @param {string} [attributeId]       Updates attribute
   * @param {Object} payload             The attribute to update
   * @param {string} payload.id          Optional: The attribute id, will be overriden by attributeId parameter
   * @param {string} payload.name        The name of the attribute
   * @param {number} payload.order       The display order of the attribute
   * @param {string} [payload.device_id] Optional: The device id this attribute is attached to. Overriden by deviceId paramter
   * @param {string} payload.user_id     The user id of the device owner
   * @param {string} payload.group_id    The group id of the parent group
   * @param {string} payload.value       The value, contents vary based on value_type
   * @param {string} payload.value_type  The type of content contained in value string
   */
  updateAttribute(
    applicationId,
    userId,
    deviceId,
    groupId,
    attributeId,
    payload
  ) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('PUT', path, { payload });
  }

  /**
   * Delete an attribute
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {string} groupId
   * @param {string} attributeId
   */
  deleteAttribute(applicationId, userId, deviceId, groupId, attributeId) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * Get an attribute
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} deviceId
   * @param {string} groupId
   * @param {string} attributeId
   */
  getAttribute(applicationId, userId, deviceId, groupId, attributeId) {
    const path = `/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /*
   * End Device Attribute Routes
   */

  /*
   * Begin Registry Routes
   */

  /**
   * Pairs a thing to account
   * @param {string} applicationIdp
   * @param {string} userId
   * @param {Object} payload
   * @param {string} payload.name        Thing's name
   * @param {string} payload.hardware_id Thing's unique hardware id
   * @param {string} payload.network     Thing's network
   */
  pairThing(applicationId, userId, payload) {
    const path = `/things/pair`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * Pairs a thing to account
   * @param {string} applicationId
   * @param {Object} userId
   * @param {Object} thingId
   * @param {string} payload.name        Thing's name
   * @param {string} payload.hardware_id Thing's unique hardware id
   * @param {string} payload.network     Thing's network
   */
  pairUpdateThing(applicationId, userId, thingId, payload) {
    const path = `/things/${thingId}/pair`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('PUT', path, { payload });
  }

  /**
   * Gets a device properties by hardware id
   * @param {string} hardwareId Device's unique hardware id
   */
  getRegistryDevice(hardwareId) {
    const path = `/things/registry/eui/${hardwareId}`;
    return this.send('GET', path);
  }

  /**
   * @param {Object} payload
   * @param {string} payload.hardware_id
   * @param {string} payload.codec
   * @param {string} payload.device_type_id
   */
  createRegistryDevice(payload) {
    const path = `/things/registry`;
    return this.send('POST', path, { payload });
  }

  /**
   * @param {string} registryId
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
    return this.send('DELETE', url);
  }

  /**
   * @param {Object}  payload
   * @param {String}  payload.name
   * @param {String}  payload.label
   * @param {String}  payload.payload
   */
  createThingDataTypeV2(payload) {
    const url = `/v2/things/datatypes`;
    return this.send('POST', url, { payload });
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
    return this.send('PUT', url, { payload });
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
   * Create a V2 datatype property
   * @param {String} typeId
   * @param {Object} payload
   */
  createThingDataTypePropertyV2(typeId, payload) {
    const url = `/v2/things/datatypes/${typeId}/properties`;
    return this.send('POST', url, { payload });
  }

  /**
   * Update V2 datatypes properties
   * @param {String} typeId
   * @param {Number} propertyId
   * @param {Object} payload
   */
  updateThingDataTypePropertyV2(typeId, pid, payload) {
    const url = `/v2/things/datatypes/${typeId}/properties/${pid}`;
    return this.send('PUT', url, { payload });
  }

  /**
   * delete V2 one things data type properties
   * @param {String} typeId
   * @param {Number} pid
   */
  deleteThingDataTypePropertyV2(typeId, pid) {
    const url = `/v2/things/datatypes/${typeId}/properties/${pid}`;
    return this.send('GET', url);
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
   * @param {string} deviceTypeId
   */
  getDeviceType(deviceTypeId) {
    const path = `/things/types/${deviceTypeId}`;
    return this.send('GET', path);
  }

  /**
   * Gets a device's meta data by device type id
   * @param {string}  deviceTypeId
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
            key: this.genCacheKey(this.getDeviceTypeMeta.name, ...arguments),
            action: this.cache.actions.get,
            onNotFound: opts.cacheOnNotFound
          }
        : false
    });
  }
  /**
   * Gets a device's meta data by device type id
   * @param {string}  deviceTypeId
   * @param {string}  key
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
            key: this.genCacheKey(
              this.getDeviceTypeMetaByKey.name,
              ...arguments
            ),
            action: this.cache.actions.get,
            onNotFound: opts.cacheOnNotFound
          }
        : false
    });
  }

  /**
   * Gets a device's channel meta by device type id
   * @param {string}  deviceTypeId
   */
  getDeviceTypeChannels(deviceTypeId) {
    const path = `/things/types/${deviceTypeId}/channels`;
    return this.send('GET', path);
  }

  /**
   * Get a device type's uses
   * @param {string}  deviceTypeId
   */
  getDeviceTypeUses(deviceTypeId) {
    const path = `/things/types/${deviceTypeId}/uses`;
    return this.send('GET', path);
  }

  /**
   * Creates a new device type
   * @param {Object} payload
   * @param {string} payload.name
   * @param {string} payload.description
   * @param {string} payload.model
   * @param {string} payload.version
   * @param {string} payload.properties
   * @param {string} payload.manufacturer
   * @param {string} payload.transport_protocol
   * @param {string} payload.protocol_version
   * @param {string} payload.category
   * @param {string} payload.codec
   * @param {string} payload.subcategory
   * @param {string} payload.parent_constraint
   * @param {string} payload.child_constraint
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
    return this.send('PUT', url, { payload });
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
    return this.send('PUT', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  channelId
   */
  deleteDeviceTypeChannel(deviceTypeId, channelId) {
    const url = `/things/types/${deviceTypeId}/channels/${channelId}`;
    return this.send('DELETE', url);
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
    return this.send('PUT', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  metaId
   */
  deleteDeviceTypeMeta(deviceTypeId, metaId) {
    const url = `/things/types/${deviceTypeId}/channels/${metaId}`;
    return this.send('DELETE', url);
  }

  /**
   * @param {String}  deviceTypeId
   * @param {Object}  payload
   * @param {string}  payload.name
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
    const url = `/things/types/${deviceTypeId}/uses/${useId}`;
    return this.send('PUT', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {String}  useId
   */
  deleteDeviceTypeUse(deviceTypeId, useId) {
    const url = `/things/types/${deviceTypeId}/uses/${useId}`;
    return this.send('DELETE', url);
  }

  /**
   * Delete a device type
   * @param {string} deviceTypeId
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
   * @param {string} integrationId
   */
  getIntegration(integrationId) {
    const path = `/integrations/${integrationId}`;
    return this.send('GET', path);
  }

  /**
   * Get all fuses
   * @param {string} applicationId
   * @param {string} userId
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   */
  getFuses(applicationId, userId, query) {
    const path = `/fuses`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, { query });
  }

  /**
   * Gets an fuses by id
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} fuseId
   */
  getFuse(applicationId, userId, fuseId) {
    const path = `/fuses/${fuseId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /**
   * Creates a fuse
   * @param {string} applicationId
   * @param {string} userId
   * @param {Object} payload
   * @param {string} payload.name
   * @param {string} payload.integration_id
   * @param {Object[]} payload.settings
   */
  createFuse(applicationId, userId, payload) {
    const path = `/fuses`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * Updates a fuse
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} fuseId
   * @param {Object} payload
   * @param {string} payload.name
   * @param {Object[]} payload.settings
   */
  updateFuse(applicationId, userId, fuseId, payload) {
    const path = `/fuses/${fuseId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('PUT', path, { payload, query });
  }

  /**
   * Disables fuses
   * @param {string} applicationId
   */
  disableFuses(applicationId) {
    const path = `/fuses/disable`;
    const query = this.setTenant(applicationId);

    return this.send('PUT', path, { query });
  }

  /**
   * Deletes a fuse
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} fuseId
   */
  deleteFuse(applicationId, userId, fuseId) {
    const path = `/fuses/${fuseId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * Deletes fuses
   * @param {string} applicationId
   * @param {string} userId
   */
  deleteFuses(applicationId, userId) {
    const url = `/fuses`;
    const query = this.setTenant(applicationId, userId);

    return this.auth.send(this.service, 'DELETE', url, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId Owner of the fuse
   * @param {string} fuseId Fuse to execute
   * @param {{}}     payload Payload to send to fuse execution
   */
  executeFuse(applicationId, userId, fuseId, payload) {
    const path = `/fuses/${fuseId}/execute`;
    payload = this.setTenant(applicationId, userId, payload);

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
   * @param {string} domain
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
   * @param {string} applicationId
   * @param {Object} query
   * @param {Number} [query.page = 0]
   * @param {Number} [query.limit = 25]
   */
  getPublicApplicationSettings(applicationId, query) {
    const path = `/applications/${applicationId}/settings`;

    return this.send('GET', path, { isPublic: true, query });
  }

  /**
   * @param {string} applicationId
   * @param {string} name
   */
  getPublicApplicationSetting(applicationId, name) {
    const path = `/applications/${applicationId}/settings/${name}`;

    return this.send('GET', path, { isPublic: true });
  }

  /**
   * @param {string} applicationId
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
   * @param {string} applicationId
   * @param {string} name
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
