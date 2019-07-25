class Executor {
  /**
   * @param {String} url
   * @param {typeof Auth} Auth
   */
  constructor(url, Auth) {
    this.service = Executor.name;
    this.url = url;
    this.auth = Auth;
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   */
  getRule(userId, ruleId) {
    const url = `${this.url}/rules/${ruleId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   */
  getRules(userId) {
    const url = `${this.url}/rules`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {Object}  payload
   */
  createRule(userId, payload) {
    const url = `${this.url}/rules`;
    payload.user_id = userId;

    return this.auth.send(this.service, 'POST', url, { payload });
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   * @param {Object}  payload
   */
  updateRule(userId, ruleId, payload) {
    const url = `${this.url}/rules/${ruleId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', url, { payload, query });
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   * @param {String}  state   'enable' or 'disable'
   */
  enableOrDisableRule(userId, ruleId, state) {
    const url = `${this.url}/rules/${ruleId}/${state}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'PUT', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   */
  deleteRule(userId, ruleId) {
    const url = `${this.url}/rules/${ruleId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'DELETE', url, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  thingId
   */
  getThingRules(userId, thingId) {
    const url = `${this.url}/rules/thing/${thingId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}    userId
   * @param {String}    ruleId
   * @param {Object}    [query]
   * @param {String}    query.type            Type of query to perform
   * @param {String}    [query.startDate]     Start date of a custom type query
   * @param {String}    [query.endDate]       End date of a custom type query
   * @param {String}    [query.limit]         Max limit to return
   * @param {Object[]}  [query.filters]       Additional key, value, operation filters
   * @param {String}    query.filters[].key   Key value of notification log object
   * @param {String}    query.filters[].value Value to search for
   * @param {String}    query.filters[].op    Operation to perform on key
   */
  getRuleLogs(userId, ruleId, query) {
    const url = `${this.url}/rules/${ruleId}/logs`;
    query = { ...query, user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * @param {String}  ruleLogId                    The id of the rule log item to get
   * @param {String}  userId                       The user id
   * @param {Objet}   [opts={}]                    Additional options
   * @param {Boolean} [opts.useCache=false]        If cached result should be retrieved
   * @param {Boolean} [opts.cacheOnNotFound=false] Whether to cache if a 404 error is returned
   *
   * @returns {Promise}
   */
  getRuleLog(ruleLogId, userId, opts) {
    opts = { useCache: false, cacheOnNotFound: false, ...opts };

    const url = `${this.url}/rule-logs/${ruleLogId}`;
    const query = { user_id: userId };

    return this.auth.send(this.service, 'GET', url, {
      query,
      cache: opts.useCache
        ? {
            key: this.auth.genCacheKey(
              this.service,
              this.getRuleLog.name,
              ...arguments
            ),
            action: this.auth.cache.actions.get,
            onNotFound: opts.cacheOnNotFound
          }
        : false
    });
  }

  /**
   * @param {String}    userId
   * @param {Object}    [query]
   * @param {String}    query.type            Type of query to perform
   * @param {String}    [query.order_dir]     The direction to return results in
   * @param {String}    [query.order_by]      The column to order the results by
   * @param {String}    [query.startDate]     Start date of a custom type query
   * @param {String}    [query.endDate]       End date of a custom type query
   * @param {String}    [query.limit]         Max limit to return
   * @param {Object[]}  [query.filters]       Additional key, value, operation filters
   * @param {String}    query.filters[].key   Key value of notification log object
   * @param {String}    query.filters[].value Value to search for
   * @param {String}    query.filters[].op    Operation to perform on key
   */
  getLogs(userId, query) {
    const url = `${this.url}/rule-logs`;
    query = { ...query, user_id: userId };

    return this.auth.send(this.service, 'GET', url, { query });
  }

  /**
   * Returns desired keys of a rule
   * @param {String} userId
   * @param {String} ruleId
   * @param {String[]} desiredKeys
   */
  async getRuleGraphQl(userId, ruleId, desiredKeys) {
    const query = {
      user_id: userId,
      query: `{getRule(id:"${ruleId}"){${desiredKeys.join(',')}}}`
    };
    const rule = await this.graphQl(query);

    return rule.data.getRule;
  }

  /**
   * Returns desired keys of rules
   * @param {String} userId
   * @param {String[]} ruleIds
   * @param {String[]} desiredKeys
   */
  async getRulesGraphQL(userId, ruleIds, desiredKeys) {
    const query = {
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
    const url = `${this.url}/graphql`;
    return this.auth.send(this.service, 'GET', url, { query });
  }
}

module.exports = Executor;
