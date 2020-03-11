const Request = require('./../Request');

class Executor extends Request {
  /**
   * @param {string} url
   * @param {string} token
   * @param {object} [options]
   */
  constructor(url, token, options = {}) {
    super(Executor.name, url, token, options);
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   */
  getRule(userId, ruleId) {
    const path = `/rules/${ruleId}`;
    const query = { user_id: userId };

    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   */
  getRules(userId) {
    const path = `/rules`;
    const query = { user_id: userId };

    return this.send('GET', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {Object}  payload
   */
  createRule(userId, payload) {
    const path = `/rules`;
    payload.user_id = userId;

    return this.send('POST', path, { payload });
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   * @param {Object}  payload
   */
  updateRule(userId, ruleId, payload) {
    const path = `/rules/${ruleId}`;
    const query = { user_id: userId };

    return this.send('PUT', path, { payload, query });
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   * @param {String}  state   'enable' or 'disable'
   */
  enableOrDisableRule(userId, ruleId, state) {
    const path = `/rules/${ruleId}/${state}`;
    const query = { user_id: userId };

    return this.send('PUT', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  ruleId
   */
  deleteRule(userId, ruleId) {
    const path = `/rules/${ruleId}`;
    const query = { user_id: userId };

    return this.send('DELETE', path, { query });
  }

  /**
   * @param {String}  userId
   * @param {String}  thingId
   */
  getThingRules(userId, thingId) {
    const path = `/rules/thing/${thingId}`;
    const query = { user_id: userId };

    return this.send('GET', path, { query });
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
    const path = `/rules/${ruleId}/logs`;
    query = { ...query, user_id: userId };

    return this.send('GET', path, { query });
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

    const path = `/rule-logs/${ruleLogId}`;
    const query = { user_id: userId };

    return this.send('GET', path, {
      query,
      cache: opts.useCache
        ? {
            key: this.auth.genCacheKey(this.getRuleLog.name, ...arguments),
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
    const path = `/rule-logs`;
    query = { ...query, user_id: userId };

    return this.send('GET', path, { query });
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
    const path = `/graphql`;
    return this.send('GET', path, { query });
  }
}

module.exports = Executor;
