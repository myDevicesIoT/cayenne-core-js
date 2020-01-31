class Cayenne {
  /**
   * @param {String} url
   * @param {typeof Auth} Auth
   */
  constructor(url, Auth) {
    this.service = Cayenne.name;
    this.url = url;
    this.auth = Auth;
  }

  /**
   * Creates the Cayenne client necessary to create things for account
   * @param {String}  userId
   */
  createClient(userId) {
    const url = `${this.url}/clients`;
    const payload = { user_id: userId };

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * Get the client for streaming subscribing
   * @param {String}  userId
   */
  getClient(userId) {
    const url = `${this.url}/clients`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /*
   * Begin Thing Routes
   */

  /**
   * @param {String}  userId
   */
  getThings(userId) {
    const url = `${this.url}/things`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Get a sensor by id
   * @param {String}  userId
   * @param {String}  thingId Thing UUI
   */
  getThing(userId, thingId) {
    const url = `${this.url}/things/${thingId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
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
    const url = `${this.url}/things`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * @param {String}  userId
   * @param {String}  thingId
   * @param {Object}  payload
   * @param {Object}  [payload.properties]
   */
  updateThing(userId, thingId, payload) {
    const url = `${this.url}/things/${thingId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', url, { payload, query });
  }

  /**
   * @param {String}  userId
   * @param {String}  thingId
   */
  deleteThing(userId, thingId) {
    const url = `${this.url}/things/${thingId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'DELETE', url, { query });
  }

  /**
   * @param {String}  userId
   */
  destroyUser(userId) {
    const url = `${this.url}/things`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'DELETE', url, { query });
  }

  /**
   * Begin command
   * @param {String} deviceTypeId
   * @param {String} command
   * @param {Object} command
   */
  emitCommand(deviceId, payload) {
    const url = `${this.url}/things/${deviceId}/cmd`;
    return this.auth.send(this.service, 'POST', url, { payload });
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
    const url = `${this.url}/things/${deviceId}/groups`;
    query = { ...query, user_id: userId };
    return this.auth.send(this.service, 'GET', url, { query });
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
    const url = `${this.url}/things/${deviceId}/groups/${groupId}`;

    return this.auth.send(this.service, 'PUT', url, { payload });
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
    const url = `${this.url}/things/${deviceId}/groups`;

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * Delete a group
   * @param {String} deviceId
   * @param {String} groupId
   */
  deleteGroup(deviceId, groupId) {
    const url = `${this.url}/things/${deviceId}/groups/${groupId}`;
    return this.auth.send(this.service, 'DELETE', url);
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
    const url = `${this.url}/things/${deviceId}/groups/${groupId}/attributes`;

    return this.auth.send(this.service, 'POST', url, { payload });
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
    const url = `${
      this.url
    }/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;

    return this.auth.send(this.service, 'PUT', url, { payload });
  }

  /**
   * Delete an attribute
   * @param {String} deviceId
   * @param {String} groupId
   * @param {String} attributeId
   */
  deleteAttribute(deviceId, groupId, attributeId) {
    const url = `${
      this.url
    }/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;
    return this.auth.send(this.service, 'DELETE', url);
  }

  /**
   * Get an attribute
   * @param {String} deviceId
   * @param {String} groupId
   * @param {String} attributeId
   */
  getAttribute(deviceId, groupId, attributeId) {
    const url = `${
      this.url
    }/things/${deviceId}/groups/${groupId}/attributes/${attributeId}`;
    return this.auth.send(this.service, 'GET', url);
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
    const url = `${this.url}/things/pair`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'POST', url, { payload });
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
    const url = `${this.url}/things/${thingId}/pair`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'PUT', url, { payload });
  }

  /**
   * Gets a device properties by hardware id
   * @param {String} hardwareId Device's unique hardware id
   */
  getRegistryDevice(hardwareId) {
    const url = `${this.url}/things/registry/eui/${hardwareId}`;
    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * @param {Object}  payload
   * @param {String}  payload.hardware_id
   * @param {String}  payload.codec
   * @param {String}  payload.devicee_type_id
   */
  createRegistryDevice(payload) {
    const url = `${this.url}/things/registry`;
    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * @param {String}  registryId
   */
  deleteRegistryDevice(registryId) {
    const url = `${this.url}/things/registry/${registryId}`;
    return this.auth.send(this.service, 'DELETE', url);
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
    const url = `${this.url}/things/datatypes`;
    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Gets V2 all things data types
   * @param {Object} query
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   */
  getThingDataTypesV2(query) {
    const url = `${this.url}/v2/things/datatypes`;
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Get V2 one things data type
   */
  getThingDataTypeV2(id) {
    const url = `${this.url}/v2/things/datatypes/${id}`;
    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Get V2 one things data type properties
   * @param {Object} query
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   */
  getThingDataTypePropertiesV2(id, query) {
    const url = `${this.url}/v2/things/datatypes/${id}/properties`;
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Get V2 one things data type property by it's id
   */
  getThingDataTypePropertyV2(id, pid) {
    const url = `${this.url}/v2/things/datatypes/${id}/properties/${pid}`;
    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Gets thing types by query
   * @param {Object} query
   */
  getThingTypes(query) {
    const url = `${this.url}/things/types`;
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Gets all thing types
   */
  getAllThingTypes() {
    const url = `${this.url}/things/types/all`;
    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Get a device type
   * @param {String} deviceTypeId
   */
  getDeviceType(deviceTypeId) {
    const url = `${this.url}/things/types/${deviceTypeId}`;
    return this.auth.send(this.service, 'GET', url);
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

    const url = `${this.url}/things/types/${deviceTypeId}/meta`;
    return this.auth.send(this.service, 'GET', url, {
      cache: opts.useCache
        ? {
            key: this.auth.genCacheKey(
              this.service,
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
   * Gets a device's meta data by device type id
   * @param {String}  deviceTypeId
   * @param {String}  key
   * @param {Objet}   [opts={}]                    Additional options
   * @param {Boolean} [opts.useCache=false]        If cached result should be retrieved
   * @param {Boolean} [opts.cacheOnNotFound=false] Whether to cache if a 404 error is returned
   */
  getDeviceTypeMetaByKey(deviceTypeId, key, opts = {}) {
    opts = { useCache: false, cacheOnNotFound: false, ...opts };

    const url = `${this.url}/things/types/${deviceTypeId}/meta/${key}`;

    return this.auth.send(this.service, 'GET', url, {
      cache: opts.useCache
        ? {
            key: this.auth.genCacheKey(
              this.service,
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
    const url = `${this.url}/things/types/${deviceTypeId}/channels`;
    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Get a device type's uses
   * @param {String}  deviceTypeId
   */
  getDeviceTypeUses(deviceTypeId) {
    const url = `${this.url}/things/types/${deviceTypeId}/uses`;
    return this.auth.send(this.service, 'GET', url);
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
    const url = `${this.url}/things/types`;
    return this.auth.send(this.service, 'POST', url, { payload });
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
    const url = `${this.url}/things/types/${deviceTypeId}/channels`;
    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * @param {String}  deviceTypeId
   * @param {Object}  payload
   * @param {String}  payload.key
   * @param {String}  payload.value
   */
  addDeviceTypeMeta(deviceTypeId, payload) {
    const url = `${this.url}/things/types/${deviceTypeId}/meta`;
    return this.auth.send(this.service, 'POST', url, { payload });
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
    const url = `${this.url}/things/types/${deviceTypeId}/uses`;
    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * Delete a device type
   * @param {String} deviceTypeId
   */
  deleteDeviceType(deviceTypeId) {
    const url = `${this.url}/things/types/${deviceTypeId}`;
    return this.auth.send(this.service, 'DELETE', url);
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
    const url = `${this.url}/integrations`;
    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Gets an integration by id
   * @param {String} integrationId
   */
  getIntegration(integrationId) {
    const url = `${this.url}/integrations/${integrationId}`;
    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * Get all fuses
   * @param {String} userId
   * @param {Number} [query.limit]
   * @param {Number} [query.page]
   */
  getFuses(userId, query) {
    const url = `${this.url}/fuses`;
    query = { ...query, user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Gets an fuses by id
   * @param {String} userId
   * @param {String} fuseId
   */
  getFuse(userId, fuseId) {
    const url = `${this.url}/fuses/${fuseId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
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
    const url = `${this.url}/fuses`;
    payload.account_id = userId;

    return this.auth.send(this.service, 'POST', url, { payload });
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
    const url = `${this.url}/fuses/${fuseId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', url, { payload, query });
  }

  /**
   * Disables fuses
   */
  disableFuses() {
    const url = `${this.url}/fuses/disable`;

    return this.auth.send(this.service, 'PUT', url, {});
  }

  /**
   * Deletes a fuse
   * @param {String} userId
   * @param {String} fuseId
   */
  deleteFuse(userId, fuseId) {
    const url = `${this.url}/fuses/${fuseId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'DELETE', url, { query });
  }
  /**
   * @public
   * @param {String} userId Owner of the fuse
   * @param {String} fuseId Fuse to execute
   * @param {{}}     payload Payload to send to fuse execution
   */
  executeFuse(userId, fuseId, payload) {
    const url = `${this.url}/fuses/${fuseId}/execute`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * * End Integrations and Fuses
   */

  /**
   * * Begin Application
   */

  getApplication(applicationId) {
    const url = `${this.url}/applications/${applicationId}`;

    return this.auth.send(this.service, 'GET', url);
  }

  /**
   *
   * @param {String} domain
   * @param {Object} query
   * @param {Number} [query.page = 0]
   * @param {Number} [query.limit = 25]
   */
  getPublicApplicationSettingsByDomain(domain, query) {
    const url = `${this.url}/applications/domains/${domain}/settings`;

    return this.auth.send(this.service, 'GET', url, { isPublic: true, query });
  }

  /**
   *
   * @param {String} applicationId
   * @param {Object} query
   * @param {Number} [query.page = 0]
   * @param {Number} [query.limit = 25]
   */
  getPublicApplicationSettings(applicationId, query) {
    const url = `${this.url}/applications/${applicationId}/settings`;

    return this.auth.send(this.service, 'GET', url, { isPublic: true, query });
  }

  /**
   * @param {String} applicationId
   * @param {String} name
   */
  getPublicApplicationSetting(applicationId, name) {
    const url = `${this.url}/applications/${applicationId}/settings/${name}`;

    return this.auth.send(this.service, 'GET', url, { isPublic: true });
  }

  /**
   * @param {String} applicationId
   * @param {Object} query
   * @param {Number} [query.page=0]
   * @param {Number} [query.limit=25]
   */
  getApplicationSettings(applicationId, query) {
    query = { page: 0, limit: 25, ...query };
    const url = `${this.url}/applications/${applicationId}/settings`;

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String} applicationId
   * @param {String} name
   */
  getApplicationSetting(applicationId, name) {
    const url = `${this.url}/applications/${applicationId}/settings/${name}`;

    return this.auth.send(this.service, 'GET', url);
  }

  /**
   * * End Applications
   */
}

module.exports = Cayenne;
