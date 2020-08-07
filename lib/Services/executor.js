const Request = require('./../Request');

class Executor extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {Object} [options]
   */
  constructor(url, token, options = {}) {
    super(Executor.name, url, token, options);
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} ruleId
   */
  getRule(applicationId, userId, ruleId) {
    const path = `/rules/${ruleId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /**
   * @param {string}   applicationId
   * @param {string}   userId
   * @param {Object}   query
   */
  getRules(applicationId, userId, query) {
    const path = `/rules`;
    query = this.setTenant(applicationId, userId, query);
    return this.send('GET', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {Object} payload
   */
  createRule(applicationId, userId, payload) {
    const path = `/rules`;
    payload = this.setTenant(applicationId, userId, payload);

    return this.send('POST', path, { payload });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} ruleId
   * @param {Object} payload
   */
  updateRule(applicationId, userId, ruleId, payload) {
    const path = `/rules/${ruleId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('PUT', path, { payload, query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} ruleId
   * @param {string} state         'enable' or 'disable'
   */
  enableOrDisableRule(applicationId, userId, ruleId, state) {
    const path = `/rules/${ruleId}/${state}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('PUT', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} ruleId
   */
  deleteRule(applicationId, userId, ruleId) {
    const path = `/rules/${ruleId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {String} userId
   */
  deleteAllRules(applicationId, userId) {
    const path = `/rules`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {String} userId
   */
  deleteAllRulesLogs(applicationId, userId) {
    const path = `/rules-logs`;
    const query = this.setTenant(applicationId, userId);

    return this.send('DELETE', path, { query });
  }

  /**
   * @param {string} applicationId
   * @param {string} userId
   * @param {string} thingId
   */
  getThingRules(applicationId, userId, thingId) {
    const path = `/rules/thing/${thingId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, { query });
  }

  /**
   * @param {string}   applicationId
   * @param {string}   userId
   * @param {string}   ruleId
   * @param {Object}   [query]
   * @param {string}   query.type            Type of query to perform
   * @param {string}   [query.startDate]     Start date of a custom type query
   * @param {string}   [query.endDate]       End date of a custom type query
   * @param {string}   [query.limit]         Max limit to return
   * @param {Object[]} [query.filters]       Additional key, value, operation filters
   * @param {string}   query.filters[].key   Key value of notification log Object
   * @param {string}   query.filters[].value Value to search for
   * @param {string}   query.filters[].op    Operation to perform on key
   */
  getRuleLogs(applicationId, userId, ruleId, query) {
    const path = `/rules/${ruleId}/logs`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, { query });
  }

  /**
   * @param {string}  applicationId
   * @param {string}  userId                       The user id
   * @param {string}  ruleLogId                    The id of the rule log item to get
   * @param {Objet}   [opts={}]                    Additional options
   * @param {Boolean} [opts.useCache=false]        If cached result should be retrieved
   * @param {Boolean} [opts.cacheOnNotFound=false] Whether to cache if a 404 error is returned
   *
   * @returns {Promise}
   */
  getRuleLog(applicationId, userId, ruleLogId, opts) {
    opts = { useCache: false, cacheOnNotFound: false, ...opts };

    const path = `/rule-logs/${ruleLogId}`;
    const query = this.setTenant(applicationId, userId);

    return this.send('GET', path, {
      query,
      cache: opts.useCache
        ? {
            key: this.genCacheKey(this.getRuleLog.name, ...arguments),
            action: this.cache.actions.get,
            onNotFound: opts.cacheOnNotFound
          }
        : false
    });
  }

  /**
   * @param {string}   applicationId
   * @param {string}   userId
   * @param {Object}   [query]
   * @param {string}   query.type            Type of query to perform
   * @param {string}   [query.order_dir]     The direction to return results in
   * @param {string}   [query.order_by]      The column to order the results by
   * @param {string}   [query.startDate]     Start date of a custom type query
   * @param {string}   [query.endDate]       End date of a custom type query
   * @param {string}   [query.limit]         Max limit to return
   * @param {Object[]} [query.filters]       Additional key, value, operation filters
   * @param {string}   query.filters[].key   Key value of notification log Object
   * @param {string}   query.filters[].value Value to search for
   * @param {string}   query.filters[].op    Operation to perform on key
   */
  getLogs(applicationId, userId, query) {
    const path = `/rule-logs`;
    query = this.setTenant(applicationId, userId, query);

    return this.send('GET', path, { query });
  }

  /**
   * Returns desired keys of a rule
   * @param {string}   applicationId
   * @param {string}   userId
   * @param {string}   ruleId
   * @param {string[]} desiredKeys
   */
  async getRuleGraphQl(applicationId, userId, ruleId, desiredKeys) {
    const query = {
      application_id: applicationId,
      user_id: userId,
      query: `{getRule(id:"${ruleId}"){${desiredKeys.join(',')}}}`
    };
    const rule = await this.graphQl(query);

    return rule.data.getRule;
  }

  /**
   * Returns desired keys of rules
   * @param {string}   applicationId
   * @param {string}   userId
   * @param {string[]} ruleIds
   * @param {string[]} desiredKeys
   */
  async getRulesGraphQL(applicationId, userId, ruleIds, desiredKeys) {
    const query = {
      application_id: applicationId,
      user_id: userId,
      query: `{getRules(ids:["${ruleIds.join('","')}"]){${desiredKeys.join(
        ','
      )}}}`
    };
    const rule = await this.graphQl(query);

    return rule.data.getRules;
  }

  /**
   * GraphQL Query
   * @param {Object} query
   */
  graphQl(query) {
    const path = `/graphql`;
    return this.send('GET', path, { query });
  }

  /**
   * @param {Object} payload
   * @param {Object} opts
   */
  migrateUser(payload, opts) {
    const path = `/move/users`;
    opts = { response: 60000, deadline: 90000, ...opts };
    opts.payload = payload;
    return this.send('POST', path, opts);
  }
}

module.exports = Executor;
